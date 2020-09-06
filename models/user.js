import Joi from 'joi';

const user = {
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
};

export const loginSchema = Joi.object({
  email: user.email,
  password: user.password
});

export const createSchema = Joi.object({
  email: user.email,
  password: user.password
});
