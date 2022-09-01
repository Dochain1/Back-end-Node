import joi from 'joi';

const id = joi.string();
const state = joi.string();
const complainant = joi.string();
const complainantLawyer = joi.string();
const defendand = joi.string();
const defendandLawyer = joi.string();
const place = joi.string();

const createBriefcaseSchema = joi.object({
  state: state.required(),
  complainant: complainant.required(),
  complainantLawyer: complainantLawyer.required(),
  defendand: defendand.required(),
  defendandLawyer: defendandLawyer.required(),
  place: place.required()
});

const updateBriefcaseSchema = joi.object({
  state,
  complainant,
  complainantLawyer,
  defendand,
  defendandLawyer,
  place
});

const getBriefcaseSchema = joi.object({
  id: id.required()
});

export {
  createBriefcaseSchema,
  updateBriefcaseSchema,
  getBriefcaseSchema
}
