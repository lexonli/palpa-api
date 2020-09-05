import Joi from 'joi';

export const projectQuerySchema = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-z]{3,30}$')).required(),
});
