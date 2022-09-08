import { Briefcase, BriefcaseSchema } from './briefcaseModel.js';

function setupModels(sequelize) {
  Briefcase.init(BriefcaseSchema, Briefcase.config(sequelize));
}

export { setupModels };
