import express from "express";
import { validatorHandler } from "../middlewares/validatorHandler.js";
import {
  createBriefcaseSchema,
  updateBriefcaseSchema,
  getBriefcaseSchema
} from "../Schemas/briefcaseSchema.js";
import { BriefcaseService } from "../Services/briefcaseServices.js";

const router = express.Router();
const service = new BriefcaseService();

router.get('/', async (req, res) => {
  try {
    const briefcases = await service.find();
    res.json(briefcases);
  } catch (error) {
    console.error(error);
  }
})

//POST

export { router };
