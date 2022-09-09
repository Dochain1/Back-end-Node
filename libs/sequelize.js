import Sequelize from "sequelize";
import dotenv from 'dotenv';
import { setupModels } from '../Db/models/index.js';

dotenv.config();

const URI = process.env.POSTGRESCONNECT;


const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  logging: true
});

const { models } = sequelize;
//receiving connection
setupModels(sequelize);
//sync ORM with db
sequelize.sync();

export { sequelize, models };
