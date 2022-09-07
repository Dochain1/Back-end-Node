import express from "express";
import path from "path";
import multer from "multer";
}import mimeTypes from "mime-types";
import { uploadToIPFS } from "../Services/ipfsService.js";
import { validatorHandler } from "../middlewares/validatorHandler";


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
  callback("", Date.now() + "." + mimeTypes.extension(file.mimetype))
  }
});

const upload = multer({
  storage: storage
});

const router = express.Router();
//GET
router.get('/', (req, res) => {
  // res.json({
  //   name: 'document-example',
  //   complaint: 'complaint-example'
  // });
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
      // console.log(file)
      const hash = await uploadToIPFS(req.file.filename);
      // console.log(hash);
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
