import nc from 'next-connect';
import cors from '../../middleware/cors';
import {
  getProject,
  updateProject,
  deleteProject,
} from '../../controllers/project';

import { projectUpdateSchema } from '../../models/project';
import validator from '../../middleware/validator';

const router = nc();
router.use(cors);

router.get((req, res) => {
  const projectId = req.query.project;
  getProject(projectId)
    .then((project) => {
      res.status(200).json({
        project,
      });
    })
    .catch((error) =>
      res.status(400).json({
        errors: [{ message: error.toString() }],
      })
    );
});

router.patch(validator(projectUpdateSchema, 'body'), async (req, res) => {
  try {
    const projectID = req.query.project;
    await updateProject(projectID, req.body);
    res.status(200).json('success');
  } catch (err) {
    res.status(400).json({
      errors: [{ message: err.toString() }],
    });
  }
});

router.delete(async (req, res) => {
  try {
    const projectID = req.query.project;
    await deleteProject(projectID);
    res.status(200).json('success');
  } catch (err) {
    res.status(400).json({
      errors: [{ message: err.toString() }],
    });
  }
});

export default router;
