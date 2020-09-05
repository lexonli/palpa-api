/**
 * Validates json body to be not empty and valid json structure
 * @param req
 * @param res
 * @param next
 */
function validator(req, res, next) {
  try {
    if (req.body == null) {
      res.status(400).json({ errors: ['request body cannot be empty'] });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ errors: ['json body is malformed'] });
  }
}

export default validator;
