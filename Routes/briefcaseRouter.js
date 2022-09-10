import express from 'express';
import {
  getAllUsers,
  getBriefcasesByUser,
  getUser,
  saveUsersInBriefcase,
} from '../Db/querys.js';
import { validatorHandler } from '../middlewares/validatorHandler.js';
import {
  createBriefcaseSchema,
  updateBriefcaseSchema,
  getBriefcaseSchema,
} from '../Schemas/briefcaseSchema.js';
import { BriefcaseService } from '../Services/briefcaseServices.js';
import { mint, totalMinted } from '../Services/smartContractService.js';

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
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const briefcases = await service.findOne(id);
    res.json(briefcases);
  } catch (error) {
    console.error(error);
  }
});

router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const user = await getUser(address);
    console.log(user.rows[0]);
    if (!user.rows.length) {
      res.json({
        status: 404,
        message: 'User does not exists or does not have briefcases',
      });
    }
    const briefcases = await getBriefcasesByUser(user.rows[0].public_key);
    const briefcasesData = await Promise.all(
      briefcases.rows.map(async (briefcase) => {
        const Case = await service.findOne(briefcase.case_id);
        return {
          case_id: Case.dataValues.case_id,
          typeComplaint: Case.dataValues.type_of_demand,
          dateAndTimeOfComplaint: Case.dataValues.crime_data,
          casePlace: Case.dataValues.place_of_case,
          crime: Case.dataValues.crime,
          crimeDate: Case.dataValues.crime_data,
          crimePlace: Case.dataValues.place_of_crime,
          defendant: Case.dataValues.name_of_defendant,
          demanding: Case.dataValues.name_of_plaintiff,
          defendantLawyer: Case.dataValues.defendants_attorney,
          demandingLawyer: Case.dataValues.plaintiffs_attorney,
        };
      })
    );
    res.json(briefcasesData);
  } catch (error) {
    console.error(error);
  }
});

//POST
router.post(
  '/',
  async (req, res) => {
    try {
      const tokenId = parseInt(await totalMinted());
      let body = {
        token_id: tokenId,
        type_of_demand: req.body.typeComplaint,
        place_of_case: req.body.casePlace,
        crime: req.body.crime,
        crime_data: req.body.dateAndTimeOfComplaint,
        place_of_crime: req.body.crimePlace,
        name_of_plaintiff: req.body.demanding,
        name_of_defendant: req.body.defendant,
        defendants_attorney: req.body.defendantLawyer,
        plaintiffs_attorney: req.body.demandingLawyer,
      };
      const address = req.body.users;
      mint(address[0], `Portfolio: ${tokenId}`);
      const users = await getAllUsers(address);
      const keys = users.map((user) => {
        return user.public_key;
      });
      if (keys.includes('undefined')) {
        res.status(401).json({
          status: false,
          message:
            'Some user address has not provided its public key (register)',
        });
        return;
      }

      const newBriefcase = await service.create(body);
      saveUsersInBriefcase(users, newBriefcase.dataValues.case_id);
      res.status(201).json(newBriefcase);
    } catch (error) {
      console.error(error);
    }
  }
);

//PATCH
router.patch(
  '/:id',
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
