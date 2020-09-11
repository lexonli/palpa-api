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

router.post(validator(projectSchema, 'body'), (req, res) => {
  try {
    const { projectName, username, pageData, isPublished, views } = req.body;
    res.status(200).json('successful');
  } catch (error) {
    res.status(400).json({
      errors: [{ message: error.toString() }],
    });
  }

  // save the project to fauna
});

export default router;
