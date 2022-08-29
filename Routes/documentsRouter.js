import express from "express";
import path from "path";
import multer from "multer";

const upload = multer({
  dest: 'uploads/'
});

const router = express.Router();
//GET
router.get('/', (req, res) => {
  // res.json({
  //   name: 'document-example',
  //   complaint: 'complaint-example'
  // });
  const fileName = 'index.html';
  res.sendFile(fileName,{
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
router.post('/upload', upload.single('document'), (req, res) => {
  res.json({
    message: "file uploaded succesfully!"
  })
});


export { router };
