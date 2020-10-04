import express from 'express';
import config from '../config/github.js';
import auth from '../middleware/auth.js';
import { authenticate } from '../controllers/user.js';
import {
  fetchGithubToken,
  storeGithubToken,
  listRepositories,
} from '../controllers/github';
import validator from '../middleware/validator';
import { connectSchema } from '../models/github';

const router = express.Router();

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
      const repos = await listRepositories(githubToken);
      await res.status(200).json({ repos });
    } catch (err) {
      await res.status(500).json({
        errors: [{ message: err.toString() }],
      });
    }
  }
);

export default router;
// octokit.request('GET /repositories/:id', {id})
