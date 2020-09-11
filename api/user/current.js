import proto from '../../utils/proto';
import cors from '../../middleware/cors';
import auth from '../../middleware/auth';
import { authenticate, getUserFromId } from '../../controllers/user';

const router = proto();
router.use(cors);
router.use(auth);

/**
 * Gets current user
 */
router.get((req, res) => {
  authenticate(req.token)
    .then((authInfo) => {
      return getUserFromId(authInfo.id);
    })
    .then((user) =>
      res.status(200).json({
        email: user.data.email,
        name: user.data.name,
        username: user.data.username,
      })
    )
    .catch((error) =>
      res.status(400).json({
        errors: [{ message: error.toString() }],
      })
    );
});

export default router;
