import Joi from 'joi';
import { user } from './user.js';

const project = {
  name: Joi.string().min(2),
  pageData: Joi.object(),
  image: Joi.link(),
};

const projectMeta = {
  isPublished: Joi.bool(),
  views: Joi.number(),
  description: Joi.string(),
};

const projectSchema = Joi.object({
  name: project.name.required(),
  // user.username is already required
  username: user.username,
  pageData: project.pageData.required(),
  isPublished: projectMeta.isPublished.required(),
  views: projectMeta.views.required(),
  image: project.image,
  description: projectMeta.description,
});

export const projectUpdateSchema = Joi.object({
  name: project.name,
  pageData: project.pageData,
  isPublished: projectMeta.isPublished,
  views: projectMeta.views,
  image: project.image,
  description: projectMeta.description,
});

export default projectSchema;
