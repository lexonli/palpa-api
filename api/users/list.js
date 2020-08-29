import faunadb, { query as q } from 'faunadb';
import nc from 'next-connect';

const router = nc();

const secret = process.env.FAUNADB_SECRET_KEY;
const client = new faunadb.Client({ secret });

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

export default router;
