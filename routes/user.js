import express from 'express';
import {
  authenticate,
  getUserFromId,
  renewToken,
  getAllUsers,
  createUser,
  isUsernameAvailable,
  loginUser,
} from '../controllers/user.js';
import validator from '../middleware/validator.js';
import auth from '../middleware/auth.js';
import { createSchema, loginSchema, usernameSchema } from '../models/user.js';
import { getFaunaError } from '../utils/fauna.js';

const router = express.Router();

/**
 * Gets the current user information by checking token
 */
router.get('/current', auth, async (req, res) => {
  try {
    const authInfo = await authenticate(req.token);
    const user = await getUserFromId(authInfo.id);
    await renewToken(req.token);
    await res.status(200).json({
      id: user.ref.id,
      email: user.data.email,
      name: user.data.name,
      username: user.data.username,
    });
  } catch (error) {
    await res.status(400).json({
      errors: [{ message: error.toString() }],
    });
  }
});

/**
 * Lists all palpa users
 */
router.get('/', (req, res) => {
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
router.post('/', validator(createSchema), (req, res) => {
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

/**
 * Logs in the user and returns a token
 */
router.post('/login', validator(loginSchema), async (req, res) => {
  try {
    const secret = await loginUser(
      req.body.email,
      req.body.password,
      req.body.rememberMe
    );
    await res.status(200).json({
      token: secret,
    });
  } catch (error) {
    await res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
});

/**
 * Checks whether username exists
 */
router.get('/username', validator(usernameSchema, 'query'), (req, res) => {
  const { username } = req.query;
  isUsernameAvailable(username)
    .then((isAvailable) => {
      return res.status(200).json({ username_available: isAvailable });
    })
    .catch((error) => {
      return res.status(500).json({
        errors: [{ message: error.toString() }],
      });
    });
});

export default router;
