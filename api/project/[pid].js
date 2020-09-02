import faunadb, { query as q } from 'faunadb';
import nc from 'next-connect';
import cors from '../../middleware/cors';

const router = nc();
router.use(cors);

const secret = process.env.FAUNADB_SECRET_KEY;
const client = new faunadb.Client({ secret });

/**
 * Gets a single project from the given project id (pid)
 * @param pid {string} - the project id
 * @returns {Promise<object>} - a promise with the project object
 */
function getProject(pid) {
  return client.query(q.Get(q.Ref(q.Collection('projects'), pid)));
}

/**
 * Sanitizes project data for response to the frontend
 * @param project - a single project taken from faunadb
 * @returns {object} - a nice looking project object
 */
function sanitized(project) {
  const { data } = project;
  delete data.user;
  return data;
}

router.get((req, res) => {
  const { pid } = req.query;
  getProject(pid)
    .then((project) => {
      res.status(200).json({ success: true, project: sanitized(project) });
    })
    .catch((error) =>
      res.status(400).json({ success: false, message: error.toString() })
    );
});

export default router;
