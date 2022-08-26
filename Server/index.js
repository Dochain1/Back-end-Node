import express from 'express';
import { routerApi } from '../Routes/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("DOCHAIN SERVER");
});

routerApi(app);

app.listen(PORT, () => {
  console.log("Listening in http://localhost:" + PORT + "/");
});
