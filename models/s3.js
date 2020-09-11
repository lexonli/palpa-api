import Joi from 'joi';

const file = {
  filename: Joi.string().required(),
  filetype: Joi.string(),
};

export const imageSchema = Joi.object({
  filename: file.filename,
  filetype: file.filetype.pattern(new RegExp('^image\\/.*')).required(),
});

export const pdfSchema = Joi.object({
  filename: file.filename,
  filetype: file.filetype.pattern(new RegExp('^application\\/pdf$')).required(),
});
