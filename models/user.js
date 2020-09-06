import Joi from 'joi';

const user = {
  username: Joi.string().pattern(new RegExp('^[a-z0-9]{3,30}$')).required(),
  name: Joi.string().pattern(new RegExp('^[A-Za-z]{1,30}$|^[A-Za-z]{1,30}\\s[A-Za-z]{1,30}$')).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
};

export const loginSchema = Joi.object({
  email: user.email,
  password: user.password,
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
