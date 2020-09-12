import nc from 'next-connect';
import cors from '../../middleware/cors';
import {
  getProject,
  updateProject,
  deleteProject,
} from '../../controllers/project';

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

router.patch(async (req, res) => {
  try {
    const projectID = req.query.project;
    const update = req.body;
    if (!projectID || !update) {
      res
        .status(400)
        .json(
          'Make sure the project ID is part of the request and update is part of the body'
        );
    }
    const dbResponse = await updateProject(projectID, update);
    if (dbResponse !== '') {
      res.status(400).json(dbResponse);
    }
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
    if (!projectID) {
      res.status(400).json('Make sure the project ID is part of the request');
    }
    const dbResponse = await deleteProject(projectID);
    if (dbResponse !== '') {
      res.status(400).json(dbResponse);
    }
    res.status(200).json('success');
  } catch (err) {
    res.status(400).json({
      errors: [{ message: err.toString() }],
    });
  }
});

export default router;
