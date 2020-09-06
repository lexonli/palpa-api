import nc from 'next-connect';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import {
  getAllUsers,
  createUser,
  isUsernameAvailable,
} from '../../controllers/user';
import { createSchema } from '../../models/user';

const router = nc();
router.use(cors);

/**
 * Lists all palpa users
 */
router.get((req, res) => {
  getAllUsers()
    .then((dbs) => {
      return res.status(200).json(dbs.data.map((user) => user.data));
    })
    .catch((error) => {
      return res.status(500).json({
        errors: [{ message: error.toString() }],
      });
    });
});

/**
 * Creates a new Palpa user
 */
router.post(validator(createSchema), (req, res) => {
  isUsernameAvailable(req.body.username)
    .then((isAvailable) => {
      if (!isAvailable) {
        throw new Error('Username provided exists already.');
      } else {
        return createUser(req.body.email, req.body.password, req.body.username, req.body.name);
      }
    })
    .then((email) => {
      res.status(200).json({
        email,
      });
    })
    .catch((error) => {
      res.status(500).json({
        errors: [{ message: error.toString() }],
      });
    });
  return res;
});

export default router;
