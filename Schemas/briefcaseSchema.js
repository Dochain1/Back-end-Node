import joi from 'joi';

const case_id = joi.string();
const type_of_demand = joi.string();
const crime = joi.string();
const crime_data = joi.string();
const name_of_plaintiff = joi.string();
const plaintiffs_attorney = joi.string();
const name_of_defendant = joi.string();
const defendants_attorney = joi.string();
const place_of_case = joi.string();
const place_of_crime = joi.string();

const createBriefcaseSchema = joi.object({
  type_of_demand: type_of_demand.required(),
  crime: crime.required(),
  crime_data: crime_data.required(),
  name_of_plaintiff: name_of_plaintiff.required(),
  plaintiffs_attorney: plaintiffs_attorney.required(),
  name_of_defendant: name_of_defendant.required(),
  defendants_attorney: defendants_attorney.required(),
  place_of_case: place_of_case.required(),
  place_of_crime: place_of_crime.required()
});

const updateBriefcaseSchema = joi.object({
  type_of_demand,
  crime,
  crime_data,
  name_of_plaintiff,
  plaintiffs_attorney,
  name_of_defendant,
  defendants_attorney,
  place_of_case,
  place_of_crime,
});

const getBriefcaseSchema = joi.object({
  case_id: case_id.required()
});

export {
  createBriefcaseSchema,
  updateBriefcaseSchema,
  getBriefcaseSchema
}
