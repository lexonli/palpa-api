import proto from '../../utils/proto';
import auth from '../../middleware/auth';
import { authenticate, getUserFromId, renewToken } from "../../controllers/user";

const router = proto();
router.use(auth);

/**
 * Gets current user
 */
router.get(async (req, res) => {
  try {
    const authInfo = await authenticate(req.token);
    const user = await getUserFromId(authInfo.id);
    await renewToken(req.token);
    await res.status(200).json({
      id: user.ref.id,
      email: user.data.email,
      name: user.data.name,
      username: user.data.username,
    })
  } catch(error) {
    await res.status(400).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;
