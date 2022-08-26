import express from "express";

const router = express.Router();
//GET
router.get('/', (req, res) => {
  res.json({
    name: 'document-example',
    complaint: 'complaint-example'
  });
})

//POST

export { router };
