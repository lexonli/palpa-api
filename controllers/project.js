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
    user: userRef,
    pageData,
    isPublished,
    views,
  };
  const project = await client.query(
    q.Create(q.Collection('projects'), {
      data: {
        ...data,
        ...extra,
        dateCreated: q.Now(),
        lastChanged: q.Now(),
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
  data.lastChanged = q.Now();
  return client.query(
    q.Update(q.Ref(q.Collection('projects'), projectID), { data })
  );
}

export function deleteProject(projectID) {
  return client.query(q.Delete(q.Ref(q.Collection('projects'), projectID)));
}

function getBoldText(text) {
  return { text, bold: true };
}

export function getLanguagesArray(languages) {
  const languageNames = Object.keys(languages);
  if (languageNames.length === 0) {
    return [];
  }
  const result = [{ text: 'Written using ' }];
  for (let i = 0; i < languageNames.length; i += 1) {
    result.push(getBoldText(languageNames[i]));
    if (i === languageNames.length - 1) {
      result.push({ text: '.' });
    } else {
      result.push({ text: ', ' });
    }
  }
  return result;
}

/**
 *
 * @param repo - A single repo object from github
 * @param languagesArray - an array of page data object representing a language
 * @return {Array} - Page data for a project
 */
function getPageData(repo, languagesArray) {
  return [
    {
      children: [
        {
          type: 'h1',
          children: [
            {
              text: 'Introduction',
            },
          ],
          id: 1602334770670,
        },
        {
          type: 'blockquote',
          children: [
            {
              text: 'You can find the repository here: ',
            },
            {
              type: 'a',
              url: repo.html_url,
              children: [
                {
                  text: repo.full_name,
                },
              ],
              id: 1602639978864,
            },
            {
              text: '',
            },
          ],
          id: 1602639888265,
        },
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
          id: 1602640019194,
        },
        {
          type: 'p',
          children: [
            {
              text: repo.description || '',
            },
          ],
        },
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
          id: 1602640019194,
        },
        {
          type: 'p',
          children: languagesArray,
          id: 10000,
        },
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
          id: 1602640019194,
        },
        {
          type: 'h2',
          children: [
            {
              text: 'Dates',
            },
          ],
          id: 1602640026917,
        },
        {
          type: 'p',
          children: [
            {
              text: `Created on: ${new Date(repo.created_at).toLocaleString()}`,
              code: true,
            },
          ],
          id: 1602640038727,
        },
        {
          type: 'p',
          children: [
            {
              text: `Last updated: ${new Date(
                repo.updated_at
              ).toLocaleString()}`,
              code: true,
            },
          ],
          id: 1602640172396,
        },
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
          id: 1602640182664,
        },
        {
          type: 'h2',
          children: [
            {
              text: 'Statistics',
            },
          ],
          id: 1602640183536,
        },
        {
          type: 'p',
          children: [
            {
              text: `Owner: ${repo.owner.login}`,
              code: true,
            },
          ],
          id: 1602640232569,
        },

        {
          type: 'p',
          children: [
            {
              text: `Stars: ${repo.stargazers_count}`,
              code: true,
            },
          ],
          id: 1602640250629,
        },
        {
          type: 'p',
          children: [
            {
              text: `Watchers: ${repo.watchers_count}`,
              code: true,
            },
          ],
          id: 1602640257826,
        },
        {
          type: 'p',
          children: [
            {
              text: `Forks: ${repo.forks_count}`,
              code: true,
            },
          ],
          id: 1602640271500,
        },
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
          id: 1602640278292,
        },
        {
          type: 'h1',
          children: [
            {
              text: 'Description',
            },
          ],
          id: 1602640279012,
        },
        {
          type: 'p',
          children: [
            {
              text: 'Talk about your github repository here! \n\n',
            },
            {
              text: 'What problem does this project solve?',
              italic: true,
            },
          ],
          id: 1602640317665,
        },
        {
          type: 'p',
          children: [
            {
              text: '',
              italic: true,
            },
          ],
          id: 1602640377672,
        },
        {
          type: 'p',
          children: [
            {
              text: 'What is the solution?',
              italic: true,
            },
          ],
          id: 1602640378026,
        },
        {
          type: 'p',
          children: [
            {
              text: '',
              italic: true,
            },
          ],
          id: 1602640384873,
        },
        {
          type: 'p',
          children: [
            {
              text: 'What are the major design decisions of your project?',
              italic: true,
            },
          ],
          id: 1602640385063,
        },
        {
          type: 'p',
          children: [
            {
              text: '',
            },
          ],
          id: 1602640031094,
        },
      ],
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
  return createProject(
    repo.name,
    userRef,
    getPageData(repo, getLanguagesArray(languages)),
    false,
    1,
    {
      description: repo.description || '',
      githubLink: repo.html_url,
      githubRepoId: repo.id,
      tags: Object.keys(languages)
    }
  );
}
