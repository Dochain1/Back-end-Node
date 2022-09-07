import { sequelize } from "../libs/sequelize";
import { Boom } from "@hapi/boom";
import { models } from "../libs/sequelize.js"
class BriefCase {
  constructor() {
    this.briefCases = [];
  }

  async create(data) {
    const newBriefCase = {
      ...data
    };
    this.briefCases.push(newBriefCase);
    return newBriefCase;
  }

  async find() {
    const briefcases = await models.briefcase.findAll();
    return briefcases;
  }

  async findOne(id) {
    const briefCase = this.briefCases.find(item => item.id === id);
    if (!briefCase) {
      throw Boom.notFound('Briefcase not found');
    }
    return briefCase;
  }

  async update(id, changes) {
    const index = this.briefCases.findIndex(item => item.id === id);
    if (index === -1) {
      throw Boom.notFound('product not found');
    }
    const briefCase = this.briefCases[index];
    this.briefCases[index] = {
      ...briefCase,
      ...changes
    };
    return this.briefCases[index];
  }

}


export { BriefCase };
