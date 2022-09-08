import { sequelize } from "../libs/sequelize.js";
import { Boom } from "@hapi/boom";
import models from "sequelize";
class BriefcaseService {
  constructor() {
    this.briefcases = [];
  }

  async create(data) {
    const newBriefcase = {
      ...data
    };
    this.briefcases.push(newBriefcase);
    return newBriefcase;
  }

  async find() {
    const briefcases = await models.Briefcase.findAll();
    return briefcases;
  }

  async findOne(id) {
    const briefcase = this.briefcases.find(item => item.id === id);
    if (!briefcase) {
      throw Boom.notFound('Briefcase not found');
    }
    return briefcase;
  }

  async update(id, changes) {
    const index = this.briefcases.findIndex(item => item.id === id);
    if (index === -1) {
      throw Boom.notFound('Briefcase not found');
    }
    const briefcase = this.briefcases[index];
    this.briefcases[index] = {
      ...briefcase,
      ...changes
    };
    return this.briefcases[index];
  }

}


export { BriefcaseService };
