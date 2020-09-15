import proto from '../../utils/proto';
import { getUserFromUsername, isUserOwner } from '../../controllers/user';
import {
  getProjectsFromUserId,
  createProject,
} from '../../controllers/project';
import validator from '../../middleware/validator';
import { usernameSchema } from '../../models/user';
import projectSchema from '../../models/project';
import optionalAuth from '../../middleware/optionalAuth';
import { handleNotFoundError } from '../../utils/fauna';

const router = proto();

router.get(
  optionalAuth,
  validator(usernameSchema, 'query'),
  async (req, res) => {
    const { username } = req.query;
    try {
      const user = await getUserFromUsername(username);
      const isOwner = await isUserOwner(req.token, user.id);
      const projects = await getProjectsFromUserId(user, isOwner);
      res.status(200).json({
        projects,
      });
    } catch (error) {
      handleNotFoundError(error, res, 'Username does not exist');
    }
  }
);

router.post(validator(projectSchema), async (req, res) => {
  try {
    const { name, username, pageData, isPublished, views } = req.body;
    // save the project to fauna
    await createProject(name, username, pageData, isPublished, views);
    res.status(200).json('success');
  } catch (error) {
    res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;
