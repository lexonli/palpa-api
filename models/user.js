import Joi from 'joi';

export const user = {
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^.{6,30}$')).required(),
};

const userMeta = {
  rememberMe: Joi.boolean().optional(),
};

export const loginSchema = Joi.object({
  email: user.email,
  password: user.password,
  rememberMe: userMeta.rememberMe,
});

export const createSchema = Joi.object({
  name: user.name,
  username: user.username,
  email: user.email,
  password: user.password,
});

export const usernameSchema = Joi.object({
  username: user.username,
});
