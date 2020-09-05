import nc from 'next-connect';
import cors from '../../middleware/cors';
import { getUserFromUsername } from "../../controllers/user";
import { getProjectsFromUserId } from "../../controllers/project";
import validator from "../../middleware/validator";
import { projectQuerySchema } from "../../models/project";

const router = nc();
router.use(cors);

router.get(validator(projectQuerySchema, 'query'), (req, res) => {
  const { username } = req.query;
  getUserFromUsername(username)
    .then((user) => getProjectsFromUserId(user))
    .then((projects) =>
      res.status(200).json({
        projects: projects
      })
    )
    .catch((error) =>
      res.status(400).json({
        errors: [{ message: error.description}]
      })
    );
});

export default router;
