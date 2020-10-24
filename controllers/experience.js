import faunadb from 'faunadb';
import { appendExperience, getUserFromUsername } from './user.js';
import client from '../config/client.js';
import { getCompanyByName } from './company.js';

const { query: q } = faunadb;

async function processUpdate(update) {
  const u = update;
  if ('startDate' in u) {
    u.startDate = q.Epoch(u.startDate, 'millisecond');
  }
  if ('endDate' in u) {
    u.endDate = q.Epoch(u.endDate, 'millisecond');
  }

  if ('company' in u) {
    u.company = await getCompanyByName(u.company);
  }

  return u;
}

export async function getExperience(experienceID) {
  return client.query(
    q.Let(
      { expDoc: q.Get(q.Ref(q.Collection('experiences'), experienceID)) },
      {
        title: q.Select(['data', 'title'], q.Var('expDoc')),
        company: q.Let(
          {
            companyDoc: q.Get(
              q.Ref(
                q.Collection('companies'),
                q.Select(['data', 'company', 'id'], q.Var('expDoc'))
              )
            ),
          },
          q.Select(['data'], q.Var('companyDoc'))
        ),
        description: q.Select(['data', 'description'], q.Var('expDoc')),
        employmentType: q.Select(['data', 'employmentType'], q.Var('expDoc')),
        user: q.Select(['data', 'user', 'id'], q.Var('expDoc')),
        startDate: q.TimeDiff(
          q.Epoch(0, 'millisecond'),
          q.Select(['data', 'startDate'], q.Var('expDoc')),
          'millisecond'
        ),
        endDate: q.Let(
          {
            end: q.Select(['data', 'endDate'], q.Var('expDoc'), null),
          },
          q.If(
            q.Equals(q.Var('end'), null),
            null,
            q.TimeDiff(q.Epoch(0, 'millisecond'), q.Var('end'), 'millisecond')
          )
        ),
      }
    )
  );
}

export default async function createExperience(
  title,
  company,
  description,
  employmentType,
  username,
  startDate,
  endDate
) {
  const user = await getUserFromUsername(username);
  const companyRef = await getCompanyByName(company);

  // Epoch function from fauna does not like undefined very
  const eDate = endDate !== undefined ? endDate : null;
  const experience = await client.query(
    q.Create(q.Collection('experiences'), {
      data: {
        title,
        company: companyRef,
        description,
        employmentType,
        user,
        // convert dates to epoch times in the form of
        // (eg. 1230728400)
        startDate: q.Epoch(startDate, 'millisecond'),
        // endDate might be null, so we only convert to epoch time
        // if it is not null, otherwise just return null
        endDate: q.If(
          q.Equals(eDate, null),
          null,
          q.Epoch(eDate, 'millisecond')
        ),
      },
    })
  );
  await appendExperience(user, experience.ref);
  return experience;
}

export async function updateExperience(experienceID, update) {
  return client.query(
    q.Update(q.Ref(q.Collection('experiences'), experienceID), {
      data: await processUpdate(update),
    })
  );
}

export async function deleteExperience(experienceID) {
  return client.query(
    q.Delete(q.Ref(q.Collection('experiences'), experienceID))
  );
}
