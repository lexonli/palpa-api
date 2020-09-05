import nc from 'next-connect';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import { loginUser } from '../../controllers/user';

const router = nc();
router.use(cors);

const hasNoFields = (fields, body) => {
  return fields.map((field) => body[field]).includes(undefined);
};

router.post(validator, (req, res) => {
  const requestFields = ['email', 'password'];
  if (hasNoFields(requestFields, req.body)) {
    return res.status(400).json({
      errors: [`invalid request body, required fields: ${requestFields}`],
    });
  }
  loginUser(req.body.email, req.body.password)
    .then((dbs) => {
      res.status(200).json({ token: dbs.secret });
    })
    .catch((error) => {
      res.status(500).json({ errors: [error.description] });
    });
  return res;
});

export default router;
