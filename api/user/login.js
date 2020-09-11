import proto from '../../utils/proto';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import { loginSchema } from '../../models/user';
import { loginUser } from '../../controllers/user';

const router = proto();

router.post(validator(loginSchema), (req, res) => {
  loginUser(req.body.email, req.body.password, req.body.rememberMe)
    .then((secret) => {
      res.status(200).json({
        token: secret,
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
