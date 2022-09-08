import { Briefcase, briefcaseSchema } from './briefcaseModel.js';

function setupModels(sequelize) {
  Briefcase.init(briefcaseSchema, Briefcase.config(sequelize));
}

export { setupModels };
