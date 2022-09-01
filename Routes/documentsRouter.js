import express from "express";
import path from "path";
import multer from "multer";
// import * as fs from 'fs';
import mimeTypes from "mime-types";
import { uploadToIPFS } from "../Services/ipfsService.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
});

const router = express.Router();
//GET
router.get('/', (req, res) => {

  const fileName = 'index.html';
  res.sendFile(fileName, {
    root: path.join(process.cwd() + '/views/'),
  }, (err) => {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  });
})

//POST
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).send({
        status: false,
        data: "no file is selected"
      });
    } else {
      const [response, hash] = await uploadToIPFS(Date.now()+ "." + mimeTypes.extension(file.mimetype), file.buffer);
      console.log(hash);
      !response ? res.json({
        status: false,
        message: "An error ocurred. Don't worry, it wasn't your fault"
      }) :
      res.json({
        status: true,
        message: "file uploaded succesfully!",
        data: {
          name: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error
    });
  }
});


export { router };
