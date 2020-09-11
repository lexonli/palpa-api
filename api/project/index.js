import proto from '../../utils/proto';
import cors from '../../middleware/cors';
import { getUserFromUsername } from '../../controllers/user';
import { getProjectsFromUserId } from '../../controllers/project';
import validator from '../../middleware/validator';
import { usernameSchema } from '../../models/user';

const router = proto();
router.use(cors);

router.get(validator(usernameSchema, 'query'), (req, res) => {
  const { username } = req.query;
  getUserFromUsername(username)
    .then((user) => getProjectsFromUserId(user))
    .then((projects) =>
      res.status(200).json({
        projects,
      })
    )
    .catch((error) =>
      res.status(400).json({
        errors: [{ message: error.toString() }],
      })
    );
});

export default router;
