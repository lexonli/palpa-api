import nc from 'next-connect';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import { getAllUsers, createUser } from '../../controllers/user';
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
        errors: [{ message: error.description }],
      });
    });
});

/**
 * Creates a new Palpa user
 */
router.post(validator(createSchema), (req, res) => {
  createUser(req.body.email, req.body.password)
    .then((email) => {
      res.status(200).json({
        email,
      });
    })
    .catch((error) => {
      res.status(500).json({
        errors: [{ message: error.description }],
      });
    });
  return res;
});

export default router;
