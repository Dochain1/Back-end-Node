import joi from 'joi';

const id = joi.number().uuid();
const name = joi.string().min(2).max(30);
const contact = joi.string();

const createLawyerSchema = joi.object({
  id: id.required(),
  name: name.required(),
  contact: contact.required()
});

const updateLawyerSchema = joi.object({
  name,
  contact
});

const getLawyerSchema = joi.object({
  id: id.required()
});

export {
  createLawyerSchema,
  updateLawyerSchema,
  getLawyerSchema
};
