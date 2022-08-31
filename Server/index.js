import express from 'express';
import cors from 'cors';
import { routerApi } from '../Routes/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

const allowlist = [
  'https://dochain.vercel.app/',
  `http://localhost:${PORT}/`
]

const options = {
  origin: (origin, cb) => {
    if (allowlist.includes(origin) || !origin) {
      cb(null, true);
    } else {
      cb(new Error('not allowed'))
    }
  }
}

app.use(express.json());
app.use(cors(options));

app.get('/', (req, res) => {
  res.redirect('/api/v1/documents')
});

routerApi(app);

app.listen(PORT, () => {
  console.log(`Listening in http://localhost:${PORT}/`);
});
