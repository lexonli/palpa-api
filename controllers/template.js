import { query as q } from 'faunadb';
import client from '../config/client';

/**
 * Gets a single template from the given template id
 * @param templateId {string} - the template id
 * @returns {Promise<object>} - a promise with the template object with pageData
 */
export async function getTemplate(templateId) {
  const template = await client.query(
    q.Get(q.Ref(q.Collection('templates'), templateId))
  );
  return template.data;
}

/**
 * Gets all the templates from the database
 * @return {Promise<object>} - a promise with all templates
 */
export async function getAllTemplates() {
  const templates = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('all_templates'))
      ),
      (ref) =>
        q.Let(
          {
            templateDoc: q.Get(ref)
          },
          {
            template: q.Select(['ref', 'id'], q.Var('templateDoc')),
            templateName: q.Select(['data', 'templateName'], q.Var('templateDoc')),
            thumbnail: q.Select(['data', 'thumbnail'], q.Var('templateDoc')),
          }
        )
    )
  );
  return templates.data;
}

/**
 * Sanitizes templates data for response to the frontend
 * @param projects - list of templates taken from faunadb
 * @returns {[object]} - list of template objects
 */
function sanitizedAll(templates) {
  return templates.map((template) => {
    const { data } = template;
    data.id = project.ref.id;
    return data;
  });
}



