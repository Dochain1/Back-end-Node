import express from 'express';
import path from 'path';
import multer from 'multer';
import mimeTypes from 'mime-types';
import { downloadFromIPFS, uploadToIPFS } from '../Services/ipfsService.js';
import { encryptMultipleKeysPGP } from '../Services/encryptService.js';
import {
  totalMinted,
  mint,
  getBriefCase,
  getTokensUri,
  getTokenUri,
} from '../Services/smartContractService.js';
import {
  getFile,
  getUser,
  saveFile,
  getSecrets,
  saveDocumentInBriefcase,
  saveSecrets,
  getDocumentsFromCase,
  getFileById,
} from '../Db/querys.js';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

const router = express.Router();
//GET
router.get('/', (req, res, next) => {
  const fileName = 'index.html';
  res.sendFile(
    fileName,
    {
      root: path.join(process.cwd() + '/views/'),
    },
    (err) => {
      if (err) {
        next(err);
      } else {
        console.log('Sent:', fileName);
      }
    }
  );
});

//POST
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const file = req.file;
    const keys = req.body.keys;
    const address = req.body.address;
    const caseId = req.body.caseId;
    const type = req.body.type;
    if (!file) {
      res.status(400).send({
        status: false,
        data: 'no file is selected',
      });
    } else {
      const { encrypted, privateKeysEncrypted } = await encryptMultipleKeysPGP(
        keys,
        file.buffer
      );
      const [response, hash] = await uploadToIPFS(
        Date.now() + '.' + mimeTypes.extension(file.mimetype),
        Buffer.from(encrypted)
      );
      const tokenId = parseInt(await totalMinted());
      mint(address, hash);
      const document = await saveFile(tokenId, caseId, type);
      saveSecrets(keys, privateKeysEncrypted, document.document_id);
      saveDocumentInBriefcase(caseId, document.document_id);
      !response
        ? res.json({
            status: false,
            message: "An error ocurred. Don't worry, it wasn't your fault",
          })
        : // console.log(file)
          res.json({
            status: true,
            message: 'file uploaded successfully!',
            data: {
              name: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              cid: hash,
              privateKey: privateKeysEncrypted,
              tokenId: tokenId,
            },
          });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error,
    });
  }
});

router.post('/get_file', async (req, res) => {
  try {
    const address = req.body.address;
    const tokenId = req.body.tokenId;
    if (!req.body.cid) {
      res.json({ message: 'The CID is not valid' });
      return;
    }
    const user = await getUser(address);
    const document = await getFile(tokenId);
    const secrets = await getSecrets(
      user.rows[0].user_id,
      document.rows[0].document_id
    );
    const data = await downloadFromIPFS(req.body.cid);
    res.json({
      message: 'send encrypted file',
      encryptedFile: data,
      privateKeyEncrypted: secrets.rows[0].private_key,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/get_documents', async (req, res) => {
  try {
    const caseId = req.body.caseId;
    const documentsByCase = await getDocumentsFromCase(caseId);
    const documents = await Promise.all(
      documentsByCase.rows.map(async (document) => {
        const tokenID = await getFileById(document.document_id);
        const uri = await getTokenUri(tokenID.rows[0].token_id);
        return { ...tokenID.rows[0], uri };
      })
    );
    res.json({
      message: 'send documents',
      documents: documents,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

export { router };
