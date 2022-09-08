import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import { setupModels } from '../Db/models/index';

dotenv.config();

const URI = process.env.POSTGRESCONNECT;


const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  logging: true
});
//receiving connection
setupModels(sequelize);
//sync ORM with db
sequelize.sync();

export { sequelize };
