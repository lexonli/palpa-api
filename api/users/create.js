import faunadb, { query as q } from 'faunadb'
import proto from '@peterjskaltsis/proto';

const router = proto()

const secret = process.env.FAUNADB_SECRET_KEY
const client = new faunadb.Client({ secret })

const hasFields = (fields, body) => {
  return fields.map(field => body[field]).includes(undefined)
}

router.post((req, res) => {
  const requestFields = ['email', 'password']
  try {
    if (req.body == null) {
      return res.status(400).json({ errors: ['request body cannot be empty']})
    }
    if (hasFields(requestFields, req.body)) {
      return res.status(400).json({ errors: [`invalid request body, required fields: ${requestFields}`]})
    }
    client.query(
      q.Create(
        q.Collection('users'),
        { credentials: { password: req.body.password },
          data: {
            email: req.body.email
          }
        }
      )
    ).then(dbs => {
      return res.status(200).json(dbs)
    })
  } catch (error) {
    return res.status(400).json({ errors : ['json body is malformed'] })
  }
})

export default router;