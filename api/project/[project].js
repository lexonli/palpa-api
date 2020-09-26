import proto from '../../utils/proto';
import cors from '../../middleware/cors';
import {
  getProject,
  updateProject,
  deleteProject,
} from '../../controllers/project';

import { projectUpdateSchema } from '../../models/project';
import validator from '../../middleware/validator';
import validateToken from '../../middleware/validateToken';
import auth from '../../middleware/auth';
import optionalAuth from '../../middleware/optionalAuth';
import { handleNotFoundError } from '../../utils/fauna';

const router = proto();
router.use(cors);

router.get(optionalAuth, async (req, res) => {
  const projectId = req.query.project;
  try {
    const project = await getProject(projectId);
    await res.status(200).json({
      project,
    });
  } catch (error) {
    handleNotFoundError(error, res, 'Project does not exist');
  }
});

router.patch(
  auth,
  validateToken,
  validator(projectUpdateSchema),
  async (req, res) => {
    try {
      const projectID = req.query.project;
      await updateProject(projectID, req.body);
      res.status(200).send();
    } catch (error) {
      handleNotFoundError(error, res, 'Given project does not exist');
    }
  }
);

router.delete(auth, validateToken, async (req, res) => {
  try {
    const projectID = req.query.project;
    await deleteProject(projectID);
    res.status(200).send();
  } catch (error) {
    handleNotFoundError(error, res, 'Given project does not exist');
  }
});

export default router;
