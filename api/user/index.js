import proto from '../../utils/proto';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import {
  getAllUsers,
  createUser,
  isUsernameAvailable,
} from '../../controllers/user';
import { createSchema } from '../../models/user';
import getFaunaError from '../../utils/fauna';

const router = proto();
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
        return res.status(400).json({
          errors: [{ message: 'Username exists already.' }],
        });
      }
      return createUser(
        req.body.email,
        req.body.password,
        req.body.username,
        req.body.name
      );
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      if (getFaunaError(error) === 'instance not unique') {
        res.status(400).json({
          errors: [{ message: 'Email exists already.' }],
        });
      } else {
        res.status(500).json({
          errors: [{ message: error.toString() }],
        });
      }
    });
  return res;
});

export default router;
