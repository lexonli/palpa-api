import nc from 'next-connect';
import cors from '../../middleware/cors';
import { getUserFromUsername } from '../../controllers/user';
import { getProjectsFromUserId } from '../../controllers/project';
import validator from '../../middleware/validator';
import { usernameSchema } from '../../models/user';
import { projectSchema } from '../../models/project';

const router = nc();
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

router.post((req, res) => {
  try {
    const { projectName } = req.body;
    if (projectName === undefined) {
      res.status(400).json('Project name must not be blank');
    }
    res.status(200).json({ projectName });
  } catch (error) {
    res.status(400).json({
      errors: [{ message: error.toString() }],
    });
  }

  // Check if project name is available

  // save the project to fauna
});

export default router;
