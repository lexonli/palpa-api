import faunadb, { query as q } from 'faunadb';
import getFaunaError from '../utils/fauna';

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
 * @param username {string}
 * @returns {Promise<object>}
 */
export function createUser(email, password, username) {
  return client
    .query(
      q.Create(q.Collection('users'), {
        credentials: { password },
        data: {
          username,
          email,
        },
      })
    )
    .then((dbs) => {
      return dbs.data.email;
    });
}

/**
 * Logs in a user and returns a promise with the token if success
 * @param email {string}
 * @param password {string}
 * @returns {Promise<object>|Promise<string>}
 */
export function loginUser(email, password) {
  return client
    .query(
      q.Login(q.Match(q.Index('users_by_email'), email), {
        password,
      })
    )
    .then((data) => data.secret);
}

/**
 * Gets the user reference from a username
 * @param username {string} - username of a faunadb user
 * @returns {Promise<object>} - promise that holds the user reference
 */
export function getUserFromUsername(username) {
  return client
    .query(q.Get(q.Match(q.Index('user_by_username'), username)))
    .then((user) => user.ref);
}

/**
 * Checks if username is available
 * @param username {string} - username of a faunadb user
 * @return {Promise<boolean>} - whether username is available
 */
export function isUsernameAvailable(username) {
  return getUserFromUsername(username)
    .then(() => {
      return false;
    })
    .catch((error) => {
      if (getFaunaError(error).code === 'instance not found') {
        return true;
      }
      throw error;
    });
}
