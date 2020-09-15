import faunadb, { query as q } from 'faunadb';
import { getFaunaError } from '../utils/fauna';

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
 * @param name {string}
 * @returns {Promise<object>}
 */
export function createUser(email, password, username, name) {
  return client
    .query(
      q.Create(q.Collection('users'), {
        credentials: { password },
        data: {
          username,
          email,
          name,
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
 * @param rememberMe {boolean}
 * @returns {Promise<object>|Promise<string>}
 */
export function loginUser(email, password, rememberMe) {
  const days = rememberMe ? 7 : 1;
  return client
    .query(
      q.Login(q.Match(q.Index('users_by_email'), email), {
        password,
        ttl: q.TimeAdd(q.Now(), days, 'day'),
      })
    )
    .then((data) => data.secret);
}

/**
 * Gets the user reference from a username
 * @param username {string} - username of a faunadb user
 * @returns {Promise<object>} - promise that holds the user reference
 */
export async function getUserFromUsername(username) {
  const user = await client.query(
    q.Get(q.Match(q.Index('user_by_username'), username))
  );
  return user.ref;
}

/**
 * Gets the user reference from a username
 * @param username {string} - username of a faunadb user
 * @returns {Promise<object>} - promise that holds the user reference
 */
export async function getUserFromUsernameAsync(username) {
  const user = await client.query(
    q.Get(q.Match(q.Index('user_by_username'), username))
  );
  return user.ref;
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
      if (getFaunaError(error) === 'instance not found') {
        return true;
      }
      throw error;
    });
}

/**
 * Authenticates the client and obtains the document ref if ok
 * @returns {*|Promise<Object>|Promise<PermissionStatus>}
 * - Promise with document ref if successful
 * @param token {string} - token from calling login
 */
export function authenticate(token) {
  const userClient = new faunadb.Client({ secret: token });
  return userClient.query(q.Identity());
}

/**
 * Get user information based on id
 * @param id {string}
 * @return {Promise<object>}
 */
export function getUserFromId(id) {
  return client.query(q.Get(q.Ref(q.Collection('users'), id)));
}

/**
 * Authenticates the client and obtains the document ref if ok
 * @returns {*|Promise<Object>|Promise<PermissionStatus>}
 * - Promise with document ref if successful
 * @param token {string} - token from calling login
 */
export async function authenticateAsync(token) {
  const userClient = new faunadb.Client({ secret: token });
  try {
    const user = await userClient.query(q.Identity());
    return user.id;
  } catch (error) {
    return false;
  }
}

/**
 * Checks whether the user sending the token matches the username
 * @param token
 * @param username
 * @return {Promise<boolean>}
 */
export async function isUsernameOwner(token, username) {
  if (token) {
    const userId = await authenticateAsync(token);
    if (userId) {
      const givenUser = await getUserFromUsernameAsync(username);
      return userId === givenUser.id;
    }
  }
  return false;
}

/**
 * Checks whether the user sending the token matches the given userId
 * @param token
 * @param givenUserId
 * @return {Promise<boolean>}
 */
export async function isUserOwner(token, givenUserId) {
  if (token) {
    const userId = await authenticateAsync(token);
    if (userId) {
      return userId === givenUserId;
    }
  }
  return false;
}
