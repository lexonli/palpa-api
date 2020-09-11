import proto from '../../utils/proto';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import { isUsernameAvailable } from '../../controllers/user';
import { usernameSchema } from '../../models/user';

const router = proto();

/**
 * Checks whether username exists
 */
router.get(validator(usernameSchema, 'query'), (req, res) => {
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
