const { Briefcase, briefcaseSchema } = require('./briefcaseModel');

function setupModels(sequelize) {
  Briefcase.init(briefcaseSchema, Briefcase.config(sequelize));
}

export { setupModels };
