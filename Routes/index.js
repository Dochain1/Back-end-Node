import express from 'express';
import {router as briefcaseRouter } from './briefcaseRouter.js';
import {router as documentRouter } from './documentsRouter.js';
const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1/', router);
  router.use('/briefcase', briefcaseRouter);
  router.use('/documents', documentRouter);
};

export { routerApi };
