import validator from '../../middleware/validator';
import { getPortfolio } from '../../controllers/portfolio';
import { isUsernameOwner } from "../../controllers/user";
import { usernameSchema } from '../../models/user';
import { getFaunaError } from '../../utils/fauna';
import optionalAuth from '../../middleware/optionalAuth';
import proto from '../../utils/proto';

const router = proto();
router.use(optionalAuth);

/**
 * Gets a portfolio
 */
router.get(validator(usernameSchema, 'query'), async (req, res) => {
  const { username } = req.query;
  let isOwner = false;
  try {
    // check if current user is portfolio owner
    isOwner = await isUsernameOwner(req.token, username)
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
    }
    res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;
