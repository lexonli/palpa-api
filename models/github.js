import Joi from 'joi';

export const github = {
  code: Joi.string().required(),
};

export const connectSchema = Joi.object({
  code: github.code,
});
