import axios from 'axios';
import querystring from 'querystring';
import faunadb from 'faunadb';
import { Octokit } from '@octokit/rest';
import config from '../config/github.js';

const { query: q } = faunadb;

/**
 * Makes a post request to github api with a code to obtain an access token
 * - code and client credentials from github
 * @param {string} code - Code returned from frontend
 * @param {string} clientId - ClientId from github
 * @param {string} clientSecret - Client Secret from github
 */
export async function fetchGithubToken(code, clientId, clientSecret) {
  return axios
    .post(config.TOKEN_URL, null, {
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
 * @param {string} secret - The fauna db client secret
 * @param {string} token - The access token from github
 * @param {string} ref - The document id unique to the authenticated
 * faunadb user
 * @returns {Promise<String>} - A promise with the same access token
 */
export async function storeGithubToken(secret, token, ref) {
  const client = new faunadb.Client({ secret });
  await client.query(
    q.Update(q.Ref(q.Collection('users'), ref), {
      data: { githubToken: token },
    })
  );
}

/**
 * Calls the github api for a list of repositories
 * @param token - The access token from github
 * @returns {Promise<[object]>}
 * - A promise with a list of repositories of the authenticated user
 */
export async function listRepositories(token) {
  const octokit = new Octokit({ auth: token });
  const repos = await octokit.paginate(octokit.repos.listForAuthenticatedUser);
  return repos.map((repo) => {
    return { id: repo.id, name: repo.name };
  });
}
