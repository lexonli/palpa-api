import Joi from 'joi';

/**
 * Validates json body to be not empty and valid json structure
 * @param schema {Joi.ObjectSchema} - Schema for the validation
 * @param reqKey {string} - either body or query
 * @return
 */
function validator(schema, reqKey) {
  //set default to check the request body
  if (!reqKey) {
    reqKey = 'body';
  }
  return function(req, res, next) {
    try {
      if (req[reqKey] == null) {
        return res.status(400).json({ errors: ['request body cannot be empty'] });
      }
      const { error } = schema.validate(req[reqKey])
      if (error) {
        return res.status(400).json({ errors: error.details })
      }
      next();
    } catch (error) {
      res.status(400).json({ errors: ['json body is malformed'] });
    }
  }
}

export default validator;
