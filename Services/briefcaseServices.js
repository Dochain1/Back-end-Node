import { sequelize } from '../libs/sequelize.js';
import { Boom } from '@hapi/boom';

const { models } = sequelize;
class BriefcaseService {
  constructor() {}

  async create(data) {
    console.log(data);
    const newBriefcase = await models.Briefcase.create(data);
    return newBriefcase;
  }

  async find() {
    const briefcases = await models.Briefcase.findAll();
    return briefcases;
  }

  async findOne(id) {
    const briefcase = await models.Briefcase.findByPk(id);
    if (!briefcase) {
      throw Boom.notFound('Briefcase not found');
    }
    return briefcase;
  }

  async update(id, changes) {
    const briefcase = await this.findOne(id);
    const update = await briefcase.update(changes);
    return update;
  }
}

export { BriefcaseService };
