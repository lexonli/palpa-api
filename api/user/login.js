import nc from 'next-connect';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import { loginSchema } from '../../models/user';
import { loginUser } from '../../controllers/user';

const router = nc();
router.use(cors);

router.post(validator(loginSchema), (req, res) => {
  loginUser(req.body.email, req.body.password)
    .then((secret) => {
      res.status(200).json({
        token: secret
      });
    })
    .catch((error) => {
      res.status(500).json({
        errors: [{ message: error.description}]
      });
    });
  return res;
});

export default router;
