import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const connectionString = process.env.POSTGRESCONNECT;

export const client = new Pool({
  connectionString,
});

client.query('SELECT * FROM Usuario', (err, res) => {
  console.log(err, res);
  client.end();
});
