/**
 * Validates json body to be not empty and valid json structure
 * @param schema {ObjectSchema} - Schema for the validation
 * @param reqKey {string} - either body or query
 * @return
 */
function validator(schema, reqKey = 'body') {
  return (req, res, next) => {
    try {
      if (req[reqKey] == null) {
        return res.status(400).json({
          errors: [{ message: 'request body cannot be empty' }],
        });
      }
      console.log(req[reqKey]);
      const { error } = schema.validate(req[reqKey], { abortEarly: false });
      if (error) {
        return res.status(400).json({
          errors: error.details,
        });
      }
      next();
    } catch (error) {
      return res.status(400).json({
        errors: [{ message: 'json body is malformed' }],
      });
    }
    return undefined;
  };
}

export default validator;
