import express from 'express';
import multer from 'multer';
import mimeTypes from 'mime-types';
import { downloadFromIPFS, uploadToIPFS } from '../Services/ipfsService.js';
import { encryptMultipleKeysPGP } from '../Services/encryptService.js';
import {
  totalMinted,
  mint,
  getTokenUri,
} from '../Services/smartContractService.js';
import {
  getDocument,
  getUser,
  saveDocument,
  getSecrets,
  saveDocumentInBriefcase,
  saveSecrets,
  getDocumentsFromCase,
  saveUser,
  getAllUsers,
} from '../Db/querys.js';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

const router = express.Router();
//GET
router.get('/', (req, res) => {
  res.send({
    message: 'welcome to dochain api',
  });
});

//POST
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const file = req.file;
    const caseId = req.body.caseId;
    const type = req.body.type;
    const address = req.body.address;
    if (!file) {
      res.status(400).send({
        status: false,
        data: 'no file is selected',
      });
    } else {
      const users = await getAllUsers(address);
      const keys = users.map((user) => {
        return user.public_key;
      });
      if (keys.includes('undefined')) {
        res.json({
          status: false,
          message: 'Some user address has not provided its public key',
        });
        return;
      }
      const { encrypted, privateKeysEncrypted } = await encryptMultipleKeysPGP(
        keys,
        file.buffer
      );
      const [response, hash] = await uploadToIPFS(
        Date.now() + '.' + mimeTypes.extension(file.mimetype),
        Buffer.from(encrypted)
      );
      const tokenId = parseInt(await totalMinted());
      mint(address[0], hash);
      const document = await saveDocument(tokenId, type, file.originalname);
      saveSecrets(keys, privateKeysEncrypted, document.token_id);
      saveDocumentInBriefcase(caseId, document.token_id);
      !response
        ? res.json({
            status: false,
            message: "An error ocurred. Don't worry, it wasn't your fault",
          })
        : res.json({
            status: true,
            message: 'file uploaded successfully!',
            data: {
              name: file.originalname,
              document_type: document.document_type,
              token_id: tokenId,
              uri: hash,
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
    const document = await getDocument(tokenId);
    const secrets = await getSecrets(
      user.rows[0].public_key,
      document.rows[0].token_id
    );
    console.log(user.rows[0]);
    console.log(document.rows[0]);
    console.log(secrets.rows[0]);
    console.log(req.body.cid);
    const data = await downloadFromIPFS(req.body.cid);
    console.log(data);
    res.json({
      message: 'send encrypted file',
      encryptedFile: data,
      privateKeyEncrypted: secrets.rows[0].private_key,
      name: document.rows[0].name,
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
        const tokenID = await getDocument(document.document_id);
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

router.post('/register', async (req, res) => {
  try {
    const address = req.body.address;
    const publicKey = req.body.publicKey;
    const email = req.body.email;
    await saveUser(publicKey, address, email);
    res.json({
      message: 'Usuario registrado',
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

export { router };
