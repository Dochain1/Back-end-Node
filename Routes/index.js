const express = require('express');

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1/', router);
};

module.exports = routerApi;
