import express from "express";
import { validatorHandler } from "../middlewares/validatorHandler";


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

export { router };
