import Joi from 'joi';

const portfolio = {
  portfolioTitle: Joi.string(),
  profileImage: Joi.string(),
  description: Joi.string(),
  coverImage: Joi.string(),
  contactMessage: Joi.string(),
  socialLinks: Joi.array(),
};

const portfolioSchema = Joi.object(portfolio);

export default portfolioSchema;
