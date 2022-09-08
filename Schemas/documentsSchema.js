import joi from 'joi';

const id = joi.number().uuid();
const hash = joi.number().uuid();
const extension = joi.string().min(2).max(5);
const name = joi.string().min(2).max(30);
const description = joi.string();
const date = joi.string();
const type = joi.string();

const createDocumentSchema = joi.object({
  id: id.required(),
  hash: hash.required(),
  extension: extension.required(),
  name: name.required(),
  description: description.required(),
  date: date.required(),
  type: type.required()
});

const updateDocumentSchema = joi.object({
  extension,
  name,
  description
});

const getDocumentSchema = joi.object({
  id: id.required()
});

export {
  createDocumentSchema,
  updateDocumentSchema,
  getDocumentSchema
};
