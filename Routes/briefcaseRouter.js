import express from "express";
import { validatorHandler } from "../middlewares/validatorHandler.js";
import {
  createBriefcaseSchema,
  updateBriefcaseSchema,
  getBriefcaseSchema
} from "../Schemas/briefcaseSchema.js";
import { BriefcaseService } from "../Services/briefcaseServices.js";
import { totalMinted } from '../Services/smartContractService.js';
const router = express.Router();
const service = new BriefcaseService();
//GET
router.get('/', async (req, res) => {
  try {
    const briefcases = await service.find();
    res.json(briefcases);
  } catch (error) {
    console.error(error);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const briefcases = await service.findOne(id);
    res.json(briefcases);
  } catch (error) {
    console.error(error);
  }
})

//POST
router.post('/',
  validatorHandler(createBriefcaseSchema, 'body'),
  async (req, res) => {
    try {
      const tokenId = parseInt(await totalMinted())
      let body = { token_id: tokenId, ...req.body };
      const newBriefcase = await service.create(body);
      res.status(201).json(newBriefcase);
    } catch (error) {
      console.error(error);
    }
  }
)

//PATCH
router.patch('/:id',
  validatorHandler(getBriefcaseSchema, 'params'),
  validatorHandler(updateBriefcaseSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const briefcase = await service.update(id, body);
      res.json(briefcase);
    } catch (error) {
      next(error);
    }
  }
);

export { router };
