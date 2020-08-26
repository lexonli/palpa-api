import proto from '@peterjskaltsis/proto';
import axios from 'axios';
import querystring from 'querystring';
import { CLIENT_ID, CLIENT_SECRET, TOKEN_URL } from '../../config/github';
import faunadb, { query as q } from 'faunadb';

/**
 * Makes a post request to github api with a code to obtain an access token
 * - code and client credentials from github
 * @param {string} code - Code returned from frontend
 * @param {string} client_id - ClientId from github
 * @param {string} client_secret - Client Secret from github
 */
function fetchGithubToken(code, client_id, client_secret) {
  return axios
    .post(TOKEN_URL, null, { params: {
        code: code,
        client_id: client_id,
        client_secret: client_secret,
      }
    })
    .then((tokenRes) => {
      const data = querystring.decode(tokenRes.data);
      // if (data.error) {
      //   throw data.error;
      // }
      data.access_token = '123token';
      return data.access_token
    })
}

function storeGithubToken(ref, token) {
  return client.query(
    q.Update(
      q.Ref(q.Collection('users'), ref),
      { data: { github_token: token } },
    )
  ).then(() => token)
}


function verifyToken(req, res) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    req.token = bearer[1];
  } else {
    res.status(403).json({ success: false, message: 'No authentication token provided'});
  }
}

function getClient(req, res) {
  if (!req.token) {
    res.status(400).json({ success: false, message: 'No authentication token provided'});
  }
  const secret = req.token;
  return new faunadb.Client({ secret });
}

/**
 * Authenticates the client and obtains the document ref if ok
 * @param client - faunadb client instantiated with secret
 * @returns {*|Promise<Object>|Promise<PermissionStatus>} - Promise with document ref if successful
 */
function authenticate(client) {
  return client.query(q.Identity())
}

const router = proto();
let client;

router.get((req, res) => {
  //TODO: Move to middleware
  res.setHeader("Access-Control-Allow-Origin", "*")
  verifyToken(req, res);
  client = getClient(req, res);

  authenticate(client)
    .then((authInfo) => {
      if (!req.query.code) {
        throw 'No code provided';
      }
      return fetchGithubToken(req.query.code, CLIENT_ID, CLIENT_SECRET)
        .then((token) => [token, authInfo.id])
    })
    .then(([token, ref]) => {
      return storeGithubToken(ref, token)
    })
    .then((token) => {
      res.status(200).json({ success: true, message: token })
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: error.toString() })
    });
});

export default router;
