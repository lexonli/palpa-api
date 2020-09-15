import proto from '../../utils/proto';
import { getUserFromUsername } from '../../controllers/user';
import {
  getProjectsFromUserId,
  createProject,
} from '../../controllers/project';
import validator from '../../middleware/validator';
import { usernameSchema } from '../../models/user';
import projectSchema from '../../models/project';

const router = proto();

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
    const { name, username, pageData, isPublished, views } = req.body;
    // save the project to fauna
    await createProject(name, username, pageData, isPublished, views);
    res.status(200).json('success');
  } catch (error) {
    res.status(400).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;