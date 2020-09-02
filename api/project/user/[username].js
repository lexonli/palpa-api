import faunadb, { query as q } from 'faunadb';
import nc from 'next-connect';
import cors from '../../../middleware/cors';

const router = nc();
router.use(cors);

const secret = process.env.FAUNADB_SECRET_KEY;
const client = new faunadb.Client({ secret });

/**
 * Gets the user reference from a username
 * @param username {string} - username of a faunadb user
 * @returns {Promise<object>} - promise that holds the user reference
 */
function getUserFromUsername(username) {
  return client
    .query(q.Get(q.Match(q.Index('user_by_username'), username)))
    .then((user) => user.ref);
}

/**
 * Gets all projects from the userId of a user
 * @param user - Reference to the user (in the form of Ref(collection=..., 123))
 * @returns {Promise<object>} - promise that contains a list of projects
 */
function getProjectsFromUserId(user) {
  return client.query(
    q.Map(q.Paginate(q.Match(q.Index('project_by_user'), user)), (ref) =>
      q.Get(ref)
    )
  );
}

/**
 * Sanitizes projects data for response to the frontend
 * @param projects - list of projects taken from faunadb
 * @returns {[object]} - list of project objects
 */
function sanitized(projects) {
  return projects.map((project) => {
    const { data } = project;
    delete data.user;
    return { [project.ref.id]: data };
  });
}

router.get((req, res) => {
  const { username } = req.query;
  getUserFromUsername(username)
    .then((user) => getProjectsFromUserId(user))
    .then((projects) =>
      res
        .status(200)
        .json({ success: true, projects: sanitized(projects.data) })
    )
    .catch((error) =>
      res.status(400).json({ success: false, message: error.toString() })
    );
});

export default router;
