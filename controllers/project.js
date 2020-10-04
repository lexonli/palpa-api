import faunadb from 'faunadb';
const { query: q } = faunadb;
import { getUserFromUsername } from './user.js';
import client from '../config/client.js';
import { sanitizedOneUserRef, sanitizedAllUserRef } from './utils.js';
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

export async function createProject(
  name,
  username,
  pageData,
  isPublished,
  views
) {
  const user = await getUserFromUsername(username);
  return client
    .query(
      q.Create(q.Collection('projects'), {
        data: {
          name,
          user,
          pageData,
          isPublished,
          views,
        },
      })
    )
    .catch((err) => {
      throw err;
    });
}

export function updateProject(projectID, update) {
  return client
    .query(
      q.Update(q.Ref(q.Collection('projects'), projectID), { data: update })
    )
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
