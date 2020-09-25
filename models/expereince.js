import Joi from 'joi';
import { user } from './user';

const experience = {
  title: Joi.string().min(2),
  company: Joi.string().min(2),
  employmentType: Joi.string().valid(
    'full-time',
    'part-time',
    'self-employed',
    'freelance',
    'contract',
    'internship',
    'apprenticeship',
    'volunteering'
  ),
  // date documentation
  // https://joi.dev/api/?v=17.2.1#dategreaterdate
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
  employmentType: experience.employmentType.required(),
  // user.username is already required
  username: user.username,
  startDate: experience.startDate.required(),
  endDate: experience.endDate,
});

export const experienceUpdateSchema = Joi.object({
  title: experience.title,
  description: experienceMeta.description,
  company: experience.company,
  employmentType: experience.employmentType,
  username: user.username,
  startDate: experience.startDate,
  endDate: experience.endDate,
});

export default experienceSchema;
