import express from "express";
import multer from "multer";

const upload = multer({
  dest: 'uploads/'
});

const router = express.Router();
//GET
router.get('/', (req, res) => {
  res.json({
    name: 'document-example',
    complaint: 'complaint-example'
  });
})

//POST
router.post('/upload', upload.single(), (req, res) => {
  res.json({
    message: "file uploaded succesfully!"
  })
});


export { router };
