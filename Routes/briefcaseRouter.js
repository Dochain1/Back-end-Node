import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: 'briefcase-example',
    lawyer: 'lawyer-example'
  });
})

//POST

export { router };
