import faunadb from 'faunadb';
import { appendProject, getUserFromUsername } from './user.js';
import client from '../config/client.js';
import { sanitizedAllUserRef, sanitizedOneUserRef } from './utils.js';

const { query: q } = faunadb;
/**
 * Sanitizes project data for response to the frontend
 * @param project - a single project taken from faunadb
 * @returns {object} - a nice looking project object
 */

/**
 * Gets a single project from the given project id (pid)
 * @param projectId {string} - the project id
 * @returns {Promise<object>} - a promise with the project object
 */
export async function getProject(projectId) {
  const project = await client.query(
    q.Get(q.Ref(q.Collection('projects'), projectId))
  );
  return sanitizedOneUserRef(project);
}

/**
 * Sanitizes projects data for response to the frontend
 * @param projects - list of projects taken from faunadb
 * @returns {[object]} - list of project objects
 */

/**
 * Gets all projects from the userId of a user
 * @param user - Reference to the user (in the form of Ref(collection=..., 123))
 * @param isOwner {boolean} - whether the user is the owner of the projects
 * @returns {Promise<object>} - promise that contains a list of projects
 */
export async function getProjectsFromUserId(user, isOwner) {
  const projects = await client.query(
    q.Let(
      {
        isOwner,
        projects: q.Map(
          q.Paginate(q.Match(q.Index('project_by_user'), user)),
          (ref) => q.Get(ref)
        ),
      },
      q.If(
        q.Var('isOwner'),
        q.Var('projects'),
        q.Filter(
          q.Var('projects'),
          q.Lambda(
            'project',
            q.Select(['data', 'isPublished'], q.Var('project'))
          )
        )
      )
    )
  );
  return sanitizedAllUserRef(projects.data);
}

async function createProject(
  name,
  userRef,
  pageData,
  isPublished,
  views,
  extra = {}
) {
  const data = {
    name,
    userRef,
    pageData,
    isPublished,
    views,
  };
  const project = await client.query(
    q.Create(q.Collection('projects'), {
      data: {
        ...data,
        ...extra,
        lastEdited: q.Now(),
      },
    })
  );
  await appendProject(userRef, project.ref);
  return project;
}

export async function createProjectForUsername(
  name,
  username,
  pageData,
  isPublished,
  views
) {
  const userRef = await getUserFromUsername(username);
  return createProject(name, userRef, pageData, isPublished, views);
}

export function updateProject(projectID, update) {
  const data = update;
  data.lastEdited = q.Now();
  return client
    .query(q.Update(q.Ref(q.Collection('projects'), projectID), { data }))
    .catch((err) => {
      throw err;
    });
}

export function deleteProject(projectID) {
  return client
    .query(q.Delete(q.Ref(q.Collection('projects'), projectID)))
    .catch((err) => {
      throw err;
    });
}

export function getLanguagesSentence(languages) {
  if (Object.keys(languages).length === 0) {
    return '';
  }
  return 'Written in '.concat(
    Object.keys(languages)
      .map((lang) => {
        return `<b>${lang}</b>`;
      })
      .join(',&nbsp;'),
    '.'
  );
}

/**
 *
 * @param repo - A single repo object from github
 * @param description - description of the repo
 * @return {Array} - Page data for a project
 */
function getPageData(repo, description) {
  return [
    {
      type: 'header',
      data: {
        text: 'Introduction',
        level: 2,
      },
    },
    {
      type: 'quote',
      data: {
        text: `${description}`,
        caption: `You can find the repository here: <a href="${repo.full_name}">${repo.html_url}</a>`,
        alignment: 'left',
      },
    },
    {
      type: 'header',
      data: {
        text: 'Dates',
        level: 2,
      },
    },
    {
      type: 'table',
      data: {
        content: [
          ['Created on', `${new Date(repo.created_at).toLocaleString()}`],
          ['Last update', `${new Date(repo.updated_at).toLocaleString()}`],
        ],
      },
    },
    {
      type: 'header',
      data: {
        text: 'Statistics',
        level: 2,
      },
    },
    {
      type: 'table',
      data: {
        content: [
          ['Owner', `${repo.owner.login}`],
          ['Stars', `${repo.stargazers_count}`],
          ['Watchers', `${repo.watchers_count}`],
          ['Forks', `${repo.forks_count}`],
        ],
      },
    },
  ];
}

/**
 * Creates a project from a github repository
 * @param userRef - fauna db user reference
 * @param repo - the repository object taken from github api
 * @param languages - languages object taken from github api
 * @return {Promise<Object>} - The created project
 */
export function createProjectFromRepo(userRef, repo, languages) {
  const description = `${repo.description || ''} ${getLanguagesSentence(
    languages
  )}`;
  return createProject(
    repo.name,
    userRef,
    getPageData(repo, description),
    true,
    1,
    {
      description: repo.description || '',
      githubLink: repo.html_url,
      githubRepoId: repo.id,
    }
  );
}
