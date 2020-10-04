import express from 'express';
import {
  getProject,
  updateProject,
  deleteProject, getProjectsFromUserId, createProject
} from "../controllers/project.js";

import projectSchema, { projectUpdateSchema } from '../models/project.js';
import validator from '../middleware/validator.js';
import validateToken from '../middleware/validateToken.js';
import getUserID from '../middleware/getUserID.js';
import auth from '../middleware/auth.js';
import optionalAuth from '../middleware/optionalAuth.js';
import { handleNotFoundError } from '../utils/fauna.js';
import { usernameSchema } from "../models/user.js";
import { getUserFromUsername, isUserOwner } from "../controllers/user.js";

const router = express.Router();

router.get('/',
  optionalAuth,
  validator(usernameSchema, 'query'),
  async (req, res) => {
    const { username } = req.query;
    try {
      const user = await getUserFromUsername(username);
      const isOwner = await isUserOwner(req.token, user.id);
      const projects = await getProjectsFromUserId(user, isOwner);
      await res.status(200).json({
        projects,
      });
    } catch (error) {
      handleNotFoundError(error, res, 'Username does not exist');
    }
  }
);

router.post('/', auth, validator(projectSchema), async (req, res) => {
  try {
    const { name, username, pageData, isPublished, views } = req.body;
    // save the project to fauna
    const project = await createProject(
      name,
      username,
      pageData,
      isPublished,
      views
    );
    await res.status(200).json(project.ref.id);
  } catch (error) {
    await res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
});

router.get('/:project', optionalAuth, async (req, res) => {
  const projectId = req.params.project;
  try {
    const project = await getProject(projectId);
    await res.status(200).json({
      project,
    });
  } catch (error) {
    console.log(error);
    handleNotFoundError(error, res, 'Project does not exist');
  }
});

router.patch('/:project',
  auth,
  getUserID('projectID'),
  validateToken,
  validator(projectUpdateSchema),
  async (req, res) => {
    try {
      const projectID = req.params.project;
      await updateProject(projectID, req.body);
      res.status(200).send();
    } catch (error) {
      handleNotFoundError(error, res, 'Given project does not exist');
    }
  }
);

router.delete('/:project', auth, getUserID('projectID'), validateToken, async (req, res) => {
  try {
    const projectID = req.params.project;
    await deleteProject(projectID);
    res.status(200).send();
  } catch (error) {
    handleNotFoundError(error, res, 'Given project does not exist');
  }
});

export default router;
