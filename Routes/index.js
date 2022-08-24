import express from 'express';

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1/', router);
};

export { routerApi };
