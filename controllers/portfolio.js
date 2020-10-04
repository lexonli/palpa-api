import faunadb from 'faunadb';
const { query: q } = faunadb;
import client from '../config/client.js';

/**
 * Gets a user's portfolio
 * @param username {string} - the username of the owner of the portfolio
 * @param isOwner {boolean}
 * - is the person using this endpoint the owner of the portfolio
 * @return {Promise<object>}
 */
async function getPortfolio(username, isOwner) {
  const portfolio = await client.query(
    q.Let(
      // setup variables, userDoc is a reference to the user
      {
        userDoc: q.Get(q.Match(q.Index('user_by_username'), username)),
        isOwner,
      },
      q.Let(
        {},
        {
          // select details we want from user
          user: q.Select(['ref', 'id'], q.Var('userDoc')),
          name: q.Select(['data', 'name'], q.Var('userDoc')),
          portfolioTitle: q.Select(
            ['data', 'portfolioTitle'],
            q.Var('userDoc')
          ),
          profileImage: q.Select(['data', 'profileImage'], q.Var('userDoc')),
          description: q.Select(['data', 'description'], q.Var('userDoc')),
          coverImage: q.Select(['data', 'coverImage'], q.Var('userDoc')),
          contactMessage: q.Select(
            ['data', 'contactMessage'],
            q.Var('userDoc')
          ),
          socialLinks: q.Select(['data', 'socialLinks'], q.Var('userDoc')),
          // projects of the user
          projects: q.Let(
            // setup variables, processedProjects is an array of
            // all projects of the user
            {
              processedProjects: q.Map(
                q.Select(['data', 'projects'], q.Var('userDoc')),
                q.Lambda(
                  'project',
                  q.Let(
                    { projectDoc: q.Get(q.Var('project')) },
                    {
                      id: q.Select(['ref', 'id'], q.Var('projectDoc')),
                      name: q.Select(['data', 'name'], q.Var('projectDoc')),
                      description: q.Select(
                        ['data', 'description'],
                        q.Var('projectDoc')
                      ),
                      image: q.Select(['data', 'image'], q.Var('projectDoc')),
                      isPublished: q.Select(
                        ['data', 'isPublished'],
                        q.Var('projectDoc')
                      ),
                    }
                  )
                )
              ),
            },
            // return value, if the person using this is an owner, we give
            // them unpublished projects as well
            // otherwise, we filter them out
            q.If(
              q.Var('isOwner'),
              q.Var('processedProjects'),
              q.Filter(
                q.Var('processedProjects'),
                q.Lambda(
                  'processedProject',
                  q.Select(['isPublished'], q.Var('processedProject'))
                )
              )
            )
          ),
          // experiences of the user
          experiences: q.Map(
            q.Select(['data', 'experiences'], q.Var('userDoc')),
            q.Lambda(
              'experience',
              q.Let(
                // setup variables, experienceDoc is a ref to a single
                // experience of the user
                { experienceDoc: q.Get(q.Var('experience')) },
                {
                  id: q.Select(['ref', 'id'], q.Var('experienceDoc')),
                  title: q.Select(['data', 'title'], q.Var('experienceDoc')),
                  description: q.Select(
                    ['data', 'description'],
                    q.Var('experienceDoc')
                  ),
                  employmentType: q.Select(
                    ['data', 'employmentType'],
                    q.Var('experienceDoc')
                  ),
                  // convert dates to epoch times in the form of
                  // (eg. 1230728400)
                  startDate: q.TimeDiff(
                    q.Epoch(0, 'second'),
                    q.Select(['data', 'startDate'], q.Var('experienceDoc')),
                    'second'
                  ),
                  // endDate might be null, so we only convert to epoch time
                  // if it is not null, otherwise just return null
                  endDate: q.Let(
                    {
                      end: q.Select(
                        ['data', 'endDate'],
                        q.Var('experienceDoc'),
                        null
                      ),
                    },
                    q.If(
                      q.Equals(q.Var('end'), null),
                      null,
                      q.TimeDiff(q.Epoch(0, 'second'), q.Var('end'), 'second')
                    )
                  ),
                  company: q.Select(
                    ['data'],
                    q.Get(q.Select(['data', 'company'], q.Var('experienceDoc')))
                  ),
                }
              )
            )
          ),
        }
      )
    )
  );
  portfolio.experiences.sort((exp1, exp2) => exp1.startDate > exp2.startDate);
  return portfolio;
}

export default getPortfolio;
