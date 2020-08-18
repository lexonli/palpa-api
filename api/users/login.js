import faunadb, { query as q } from 'faunadb';
import proto from '@peterjskaltsis/proto';

const router = proto();

const secret = process.env.FAUNADB_SECRET_KEY;
const client = new faunadb.Client({ secret });

const hasNoFields = (fields, body) => {
  return fields.map((field) => body[field]).includes(undefined);
};

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
        q.Login(q.Match(q.Index('users_by_email'), req.body.email), {
          password: req.body.password,
        })
      )
      .then((dbs) => {
        res.status(200).json({ token: dbs.secret });
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
