import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.json({
      name: 'briefcase-example',
      lawyer: 'lawyer-example'
    });
  } catch (error) {
    console.error(error);
  }
})

//POST
router.post('/', (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    res.status(201).json(body);
  } catch (error) {
    console.error(error);
  }
})

export { router };
