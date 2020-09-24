import Joi from 'joi';
import { user } from './user';

const experience = {
  title: Joi.string().min(2),
  company: Joi.string().min(2),
  employmentType: 'should be enum',
  startDate: Joi.date(),
  endDate: Joi.date(),
};

const experienceMeta = {
  description: Joi.string(),
};

const experienceSchema = Joi.object({
  title: experience.title.required(),
  company: experience.company,
  description: experienceMeta.description,
  employmentType: experience.employmentType,
  username: user.username,
  startDate: experience.startDate.required(),
  endDate: experience.endDate,
});

export const experienceUpdateSchema = Joi.object({
  name: experience.name,
  description: experienceMeta.description,
});

export default experienceSchema;
