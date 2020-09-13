import Joi from 'joi';
import { user } from './user';

const project = {
  name: Joi.string().min(2).required(),
  pageData: Joi.object().required(),
  image: Joi.link(),
};

const projectMeta = {
  isPublished: Joi.bool().required(),
  views: Joi.number().required(),
  description: Joi.string(),
};

const projectSchema = Joi.object({
  name: project.name,
  username: user.username,
  pageData: project.pageData,
  isPublished: projectMeta.isPublished,
  views: projectMeta.views,
  image: project.image,
  description: projectMeta.description,
});

export default projectSchema;
