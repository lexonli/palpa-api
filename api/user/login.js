import proto from '../../utils/proto';
import validator from '../../middleware/validator';
import { loginSchema } from '../../models/user';
import { loginUser } from '../../controllers/user';

const router = proto();

router.post(validator(loginSchema), async (req, res) => {
  try {
    const secret = await loginUser(req.body.email, req.body.password, req.body.rememberMe)
    await res.status(200).json({
      token: secret,
    });
  } catch(error) {
    await res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;
