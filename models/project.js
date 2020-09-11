import Joi from 'joi';
import { user } from 'user';

const project = {
  name: Joi.string().min(2).required(),
  pageData: Joi.object().required(),
};

const projectMeta = {
  isPublished: Joi.bool().required(),
  views: Joi.number().required(),
};

export const projectSchema = Joi.object({
  name: project.name,
  username: user.username,
  isPublished: projectMeta.isPublished,
  views: Joi.number().required(),
});
