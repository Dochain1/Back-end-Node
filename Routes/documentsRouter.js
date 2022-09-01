import express from 'express';
import path from 'path';
import multer from 'multer';
import mimeTypes from 'mime-types';
import { downloadFromIPFS, uploadToIPFS } from '../Services/ipfsService.js';
import { encryptMultipleKeysPGP } from '../Services/encryptService.js';

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
      !response
        ? res.json({
            status: false,
            message: "An error ocurred. Don't worry, it wasn't your fault",
          })
        : // console.log(file)
          res.json({
            status: true,
            message: 'file uploaded succesfully!',
            data: {
              name: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              cid: hash,
              privateKey: privateKeysEncrypted,
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
    if (!req.body.cid) {
      res.json({ message: 'The CID is not valid' });
      return;
    }
    const data = await downloadFromIPFS(req.body.cid);
    res.send({
      message: 'send encrypted file',
      encryptedFile: data,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

export { router };
