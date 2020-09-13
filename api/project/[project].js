import nc from 'next-connect';
import cors from '../../middleware/cors';
import {
  getProject,
  updateProject,
  deleteProject,
} from '../../controllers/project';

import projectSchema from '../../models/project';

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

function validateUpdate(update) {
  const unrecognisedField = [];
  Object.keys(update).forEach((key) => {
    if (!(key in projectSchema)) unrecognisedField.push(key);
  });

  if (unrecognisedField.length !== 0) {
    return `${unrecognisedField} are not accepted by the project API`;
  }
  return '';
}

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
    const validationResponse = validateUpdate(update);
    if (validationResponse !== '') {
      res.status(400).json(validationResponse);
    }
    const dbResponse = await updateProject(projectID, update);
    if (dbResponse !== '') {
      res.status(400).json(dbResponse);
    }
    res.status(200).json('success');
  } catch (err) {
    res.status(500).json({
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
    res.status(500).json({
      errors: [{ message: err.toString() }],
    });
  }
});

export default router;
