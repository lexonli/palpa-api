import express from 'express';
import validator from '../middleware/validator.js';
import { getPortfolio, updatePortfolio } from '../controllers/portfolio.js';
import { isUsernameOwner } from '../controllers/user.js';
import { usernameSchema } from '../models/user.js';
import portfolioSchema from '../models/portfolio';
import { getFaunaError } from '../utils/fauna.js';
import optionalAuth from '../middleware/optionalAuth.js';

const router = express.Router();

/**
 * Gets a portfolio
 */
router.get(
  '/:username',
  optionalAuth,
  validator(usernameSchema, 'params'),
  async (req, res) => {
    const { username } = req.params;
    let isOwner = false;
    try {
      // check if current user is portfolio owner
      isOwner = await isUsernameOwner(req.token, username);
      // fetch portfolio
      const portfolio = await getPortfolio(username, isOwner);
      res.status(200).json(portfolio);
    } catch (error) {
      // likely to be an invalid username input from client
      if (getFaunaError(error) === 'instance not found') {
        res.status(400).json({
          errors: [
            {
              message:
                "There's a problem getting the portfolio with that username",
            },
          ],
        });
      } else {
        res.status(500).json({
          errors: [{ message: error.toString() }],
        });
      }
    }
  }
);

/**
 * Updates a portfolio
 */
router.post(
  '/:username',
  optionalAuth,
  validator(usernameSchema, 'params'),
  validator(portfolioSchema),
  async (req, res) => {
    const { username } = req.params;
    let isOwner = false;
    try {
      // check if current user is portfolio owner
      isOwner = await isUsernameOwner(req.token, username);
      if (isOwner) {
        // fetch portfolio
        await updatePortfolio(username, req.body);
        res.status(200).send();
      } else {
        res.status(400).json({
          errors: [
            {
              message: 'You are not allowed to access this resource.',
            },
          ],
        });
      }
    } catch (error) {
      // likely to be an invalid username input from client
      if (getFaunaError(error) === 'instance not found') {
        res.status(400).json({
          errors: [
            {
              message:
                "There's a problem updating the portfolio with that username",
            },
          ],
        });
      } else {
        res.status(500).json({
          errors: [{ message: error.toString() }],
        });
      }
    }
  }
);

export default router;
