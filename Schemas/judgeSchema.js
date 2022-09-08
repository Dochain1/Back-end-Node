import joi from 'joi';

const id = joi.number().uuid();
const name = joi.string().min(2).max(30);
const contact = joi.string();

const createJudgeSchema = joi.object({
  id: id.required(),
  name: name.required(),
  contact: contact.required()
});

const updateJudgeSchema = joi.object({
  name,
  contact
});

const getJudgeSchema = joi.object({
  id: id.required()
});

export {
  createJudgeSchema,
  updateJudgeSchema,
  getJudgeSchema
};
