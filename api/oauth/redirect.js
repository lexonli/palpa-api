import proto from '@peterjskaltsis/proto';
import axios from 'axios';
import querystring from 'querystring';
import faunadb, { query as q } from 'faunadb';
import { Octokit } from '@octokit/rest';
import { CLIENT_ID, CLIENT_SECRET, TOKEN_URL } from '../../config/github';

/**
 * Makes a post request to github api with a code to obtain an access token
 * - code and client credentials from github
 * @param {string} code - Code returned from frontend
 * @param {string} clientId - ClientId from github
 * @param {string} clientSecret - Client Secret from github
 */
function fetchGithubToken(code, clientId, clientSecret) {
  return axios
    .post(TOKEN_URL, null, {
      params: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
      },
    })
    .then((tokenRes) => {
      const data = querystring.decode(tokenRes.data);
      if (data.error) throw new Error(data.error);
      return data.access_token;
    });
}

/**
 * Stores the github token into the authenticated user in the database
 * @param client - The faunadb client
 * @param {string} token - The access token from github
 * @param {string} ref - The document id unique to the authenticated
 * faunadb user
 * @returns {Promise<String>} - A promise with the same access token
 */
function storeGithubToken(client, token, ref) {
  return client
    .query(
      q.Update(q.Ref(q.Collection('users'), ref), {
        data: { github_token: token },
      })
    )
    .then(() => token);
}

/**
 * Calls the github api for a list of repositories
 * @param token - The access token from github
 * @returns {Promise<[object]>}
 * - A promise with a list of repositories of the authenticated user
 */
function listRepositories(token) {
  const octokit = new Octokit({ auth: token });
  return octokit
    .paginate(octokit.repos.listForAuthenticatedUser)
    .then((repos) => {
      return repos.map((repo) => {
        return { id: repo.id, name: repo.name };
      });
    });
}

function verifyToken(req, res) {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const [, token] = bearerHeader.split(' ');
    req.token = token;
  } else {
    res
      .status(403)
      .json({ success: false, message: 'No authentication token provided' });
  }
}

function getClient(req, res) {
  if (!req.token) {
    res
      .status(400)
      .json({ success: false, message: 'No authentication token provided' });
  }
  const secret = req.token;
  return new faunadb.Client({ secret });
}

/**
 * Authenticates the client and obtains the document ref if ok
 * @param client - faunadb client instantiated with secret
 * @returns {*|Promise<Object>|Promise<PermissionStatus>}
 * - Promise with document ref if successful
 */
function authenticate(client) {
  return client.query(q.Identity());
}

const router = proto();

router.get((req, res) => {
  // TODO: Move to middleware
  res.setHeader('Access-Control-Allow-Origin', '*');
  verifyToken(req, res);

  const client = getClient(req, res);

  authenticate(client)
    .then((authInfo) => {
      if (!req.query.code) {
        throw new Error('No code provided');
      }
      return fetchGithubToken(
        req.query.code,
        CLIENT_ID,
        CLIENT_SECRET
      ).then((token) => [token, authInfo.id]);
    })
    .then(([token, ref]) => storeGithubToken(client, token, ref))
    .then((token) => listRepositories(token))
    .then((repos) => res.status(200).json({ success: true, repos }))
    .catch((error) =>
      res.status(400).json({ success: false, message: error.toString() })
    );
});

export default router;
