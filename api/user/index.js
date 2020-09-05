import nc from 'next-connect';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import { getAllUsers, createUser } from '../../controllers/user';

const router = nc();
router.use(cors);

const hasNoFields = (fields, body) => {
  return fields.map((field) => body[field]).includes(undefined);
};

/**
 * Lists all palpa users
 */
router.get((req, res) => {
  getAllUsers()
    .then((dbs) => {
      return res.status(200).json(dbs.data.map((user) => user.data));
    })
    .catch((e) => {
      return res.status(500).json({ error: e });
    });
});

/**
 * Creates a new Palpa user
 */
router.post(validator, (req, res) => {
  const requestFields = ['email', 'password'];
  if (hasNoFields(requestFields, req.body)) {
    return res.status(400).json({
      errors: [`invalid request body, required fields: ${requestFields}`],
    });
  }
  createUser(req.body.email, req.body.password)
    .then((dbs) => {
      res.status(200).json(dbs);
    })
    .catch((error) => {
      res.status(500).json({ errors: [error.description] });
    });
  return res;
});

export default router;
