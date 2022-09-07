import express from 'express';
import { validatorHandler } from "../middlewares/validatorHandler";
import {router as briefcaseRouter } from './briefcaseRouter.js';
import {router as documentRouter } from './documentsRouter.js';
// import {router as uploadsRouter } from './upload';
const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1/', router);
  router.use('/briefcase', briefcaseRouter);
  router.use('/documents', documentRouter);
  // router.use('/upload', uploadsRouter);
};

export { routerApi };
