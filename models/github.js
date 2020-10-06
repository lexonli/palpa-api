import Joi from 'joi';

export const connectSchema = Joi.object({
  code: Joi.string().required(),
});

export const selectSchema = Joi.object({
  repos: Joi.array().required(),
});
