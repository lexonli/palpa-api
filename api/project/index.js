import nc from 'next-connect';
import cors from '../../middleware/cors';
import { getUserFromUsername } from '../../controllers/user';
import {
  getProjectsFromUserId,
  createProject,
} from '../../controllers/project';
import validator from '../../middleware/validator';
import { usernameSchema } from '../../models/user';
import projectSchema from '../../models/project';

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

router.post(validator(projectSchema, 'body'), async (req, res) => {
  try {
    const { projectName, username, pageData, isPublished, views } = req.body;
    // save the project to fauna
    const dbResponse = await createProject(
      projectName,
      username,
      pageData,
      isPublished,
      views
    );

    if (dbResponse !== '') {
      res.status(400).json(dbResponse);
    }
    res.status(200).json('success');
  } catch (error) {
    res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;
