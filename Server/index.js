import express from 'express';
import { routerApi } from '../Routes/index.js';
import { logErrors, errorHandler, boomErrorHandler } from '../middlewares/errorHandler'

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res, next) => {
  res.redirect('/api/v1/documents')
});

routerApi(app);

//middlewares
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Listening in http://localhost:" + PORT + "/");
});
