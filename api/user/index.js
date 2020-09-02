import faunadb, { query as q } from 'faunadb';
import nc from 'next-connect';
import cors from '../../middleware/cors';

const router = nc();
router.use(cors);

const secret = process.env.FAUNADB_SECRET_KEY;
const client = new faunadb.Client({ secret });

const hasNoFields = (fields, body) => {
  return fields.map((field) => body[field]).includes(undefined);
};

/**
 * Lists all palpa users
 */
router.get((req, res) => {
  client
    .query(
      q.Map(
        // iterate each item in result
        q.Paginate(
          // make paginatable
          q.Match(
            // query index
            q.Index('all_users') // specify source
          )
        ),
        (ref) => q.Get(ref) // lookup each result by its reference
      )
    )
    .then((dbs) => {
      return res.status(200).json(dbs.data.map((user) => user.data));
    })
    .catch((e) => {
      return res.status(500).json({ error: e });
    });
});

/**
 * Creates a new Palpa user
 */
router.post((req, res) => {
  const requestFields = ['email', 'password'];
  try {
    if (req.body == null) {
      return res.status(400).json({ errors: ['request body cannot be empty'] });
    }
    if (hasNoFields(requestFields, req.body)) {
      return res.status(400).json({
        errors: [`invalid request body, required fields: ${requestFields}`],
      });
    }
    client
      .query(
        q.Create(q.Collection('users'), {
          credentials: { password: req.body.password },
          data: {
            email: req.body.email,
          },
        })
      )
      .then((dbs) => {
        res.status(200).json(dbs);
      })
      .catch((error) => {
        res.status(500).json({ errors: [error.description] });
      });
  } catch (error) {
    res.status(400).json({ errors: ['json body is malformed'] });
  }
  return res;
});

export default router;
