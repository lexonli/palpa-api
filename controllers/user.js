import faunadb, { query as q } from 'faunadb';

const secret = process.env.FAUNADB_SECRET_KEY;
const client = new faunadb.Client({ secret });

/**
 * Lists all users
 * @returns {Promise<object>}
 */
export function getAllUsers() {
  return client.query(
    q.Map(q.Paginate(q.Match(q.Index('all_users'))), (ref) => q.Get(ref))
  );
}

/**
 * Creates a user in faunadb
 * @param email {string}
 * @param password {string}
 * @returns {Promise<object>}
 */
export function createUser(email, password) {
  return client.query(
    q.Create(q.Collection('users'), {
      credentials: { password },
      data: {
        email,
      },
    })
  );
}

/**
 * Logs in a user and returns a promise with the token if success
 * @param email {string}
 * @param password {string}
 * @returns {Promise<object>}
 */
export function loginUser(email, password) {
  return client.query(
    q.Login(q.Match(q.Index('users_by_email'), email), {
      password,
    })
  );
}
