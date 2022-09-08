import joi from 'joi';

const id = joi.number().uuid();
const type = joi.string();
const place = joi.string();
const crime = joi.string();
const crimeDate = joi.string();
const crimePlace = joi.string();
const complainantName = joi.string();
const defendandName = joi.string();
const complainantLawyer = joi.string();
const defendandLawyer = joi.string();





const createComplaintSchema = joi.object({
  id: id.required(),
  type: type.required(),
  place: place.required(),
  crime: crime.required(),
  crimeDate: crimeDate.required(),
  crimePlace: crimePlace.required(),
  complainantName: complainantName.required(),
  defendandName: defendandName.required(),
  complainantLawyer: complainantLawyer.required(),
  defendandLawyer: defendandLawyer.required()
});

const updateComplaintSchema = joi.object({
  type,
  place,
  crime,
  crimeDate,
  crimePlace,
  complainantName,
  defendandName,
  complainantLawyer,
  defendandLawyer
});

const getComplaintSchema = joi.object({
  id: id.required()
});

export {
  createComplaintSchema,
  updateComplaintSchema,
  getComplaintSchema
};
