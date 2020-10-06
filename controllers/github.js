import axios from 'axios';
import querystring from 'querystring';
import faunadb from 'faunadb';
import { Octokit } from '@octokit/rest';
import config from '../config/github.js';
import client from "../config/client";

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
 * Stores the github token into the authenticated user in the database
 * @param {string} userId - The fauna db user id
 * @return {Promise<object>}
 */
export async function getGithubToken(userId) {
  return client.query(
    q.Select(['data', 'githubToken'], q.Get(q.Ref(q.Collection('users'), userId)))
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

/**
 * Calls the github api for a list of repositories
 * @param githubToken- The access token from github
 * @param repoIds - The array of repository IDs that are selected
 * @returns {Promise<[object]>}
 * - A promise with a selected list of repositories of the authenticated user
 */
export async function listRepositoriesForIds(githubToken, repoIds) {
  const octokit = new Octokit({ auth: githubToken });
  const repos = await octokit.paginate(octokit.repos.listForAuthenticatedUser);
  const selectedRepos = repos.filter((repo) => repoIds.includes(repo.id));
  if (selectedRepos.length === repoIds.length) {
    return selectedRepos;
  } else {
    throw new Error('One or more repositories could not be selected')
  }
}

/**
 * Gets a breakdown of languages for a specific repo
 * @param githubToken - The access token from github
 * @param repo - The repo object data taken from listRepositoriesForIds
 * @return {Promise<[object]>} - An object with language name as key and size as field
 */
export async function getLanguagesForRepo(githubToken, repo) {
  const octokit = new Octokit({ auth: githubToken });
  const languagesResponse = await octokit.request('GET /repos/{owner}/{repo}/languages', {
    owner: repo.owner.login,
    repo: repo.name
  })
  return languagesResponse.data
}