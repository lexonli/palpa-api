import express from 'express';
import config from '../config/github.js';
import auth from '../middleware/auth.js';
import { authenticate } from '../controllers/user.js';
import {
  fetchGithubToken,
  storeGithubToken,
  listRepositories,
  getGithubToken,
  listRepositoriesForIds,
  getLanguagesForRepo,
} from '../controllers/github';
import validator from '../middleware/validator';
import { connectSchema, selectSchema } from '../models/github';
import { createProjectFromRepo } from '../controllers/project';

const router = express.Router();

/**
 * After user auths from
 * https://github.com/login/oauth/authorize?client_id=623db91f2020120f6c63,
 * frontend will receive a code from github, this code will be used to fetch
 * the github token from github and store it in a user object in fauna and then
 * fetch a list of all the repositories of the user and return it to
 * the frontend
 */
router.get(
  '/connect',
  validator(connectSchema, 'query'),
  auth,
  async (req, res) => {
    try {
      const authInfo = await authenticate(req.token);
      const githubToken = await fetchGithubToken(
        req.query.code,
        config.CLIENT_ID,
        config.CLIENT_SECRET
      );
      await storeGithubToken(req.token, githubToken, authInfo.id);
      await res.status(200).send();
    } catch (err) {
      await res.status(500).json({
        errors: [{ message: err.toString() }],
      });
    }
  }
);

/**
 * Gets a list of repositories for the user
 */
router.get('/repos', auth, async (req, res) => {
  try {
    const userRef = await authenticate(req.token);
    const githubToken = await getGithubToken(userRef.id);
    const repos = await listRepositories(githubToken);
    await res.status(200).json(repos);
  } catch (err) {
    await res.status(500).json({
      errors: [{ message: err.toString() }],
    });
  }
});

/**
 * This is called after user selects github repos to generate projects
 */
router.post('/select', validator(selectSchema), auth, async (req, res) => {
  try {
    const userRef = await authenticate(req.token);
    const githubToken = await getGithubToken(userRef.id);
    const selectedRepos = await listRepositoriesForIds(
      githubToken,
      req.body.repos
    );
    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    for (const repo of selectedRepos) {
      const languages = await getLanguagesForRepo(githubToken, repo);
      await createProjectFromRepo(userRef, repo, languages);
    }
    await res.status(200).send();
  } catch (err) {
    await res.status(500).json({
      errors: [{ message: err.toString() }],
    });
  }
});

export default router;
