const express = require('express');
const routerApi = require('../Routes/index.js');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (res, req) => {
  res.send("DOCHAIN SERVER");
});

routerApi(app);

app.listen(PORT, () => {
  console.log("Our port is " + PORT);
});
