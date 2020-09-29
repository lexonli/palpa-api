import { query as q } from 'faunadb';
import { getUserFromUsername } from './user';
import client from '../config/client';
import { getCompanyByName } from './company';
import { sanitizedOneUserRef } from './utils';

function sanitizedOneDate(experience) {
  const { data } = experience;
  const startDiff = q.TimeDiff(q.Epoch(0, 'second'), data.startDate, 'second');
  console.log(startDiff);
  // data.startDate =
  // endDate might be null, so we only convert to epoch time
  // if it is not null, otherwise just return null
  // data.endDate = q.If(
  //   q.Equals(data.endDate, null),
  //   null,
  //   q.TimeDiff(q.Epoch(0, 'second'), data.endDate, 'second')
  // );
}

function sanitizedOneExperience(experience) {
  sanitizedOneUserRef(experience);
  sanitizedOneDate(experience);
  return experience;
}

export async function getExperience(experienceID) {
  const experience = await client.query(
    q.Let(
      { expDoc: q.Get(q.Ref(q.Collection('experiences'), experienceID)) },
      {
        title: q.Select(['data', 'title'], q.Var('expDoc')),
        company: q.Select(['data', 'company'], q.Var('expDoc')),
        description: q.Select(['data', 'description'], q.Var('expDoc')),
        employmentType: q.Select(['data', 'employmentType'], q.Var('expDoc')),
        user: q.Select(['data', 'user'], q.Var('expDoc')),
        startDate: q.TimeDiff(
          q.Epoch(0, 'second'),
          q.Select(['data', 'startDate'], q.Var('expDoc')),
          'second'
        ),
        endDate: q.TimeDiff(
          q.Epoch(0, 'second'),
          q.Select(['data', 'startDate'], q.Var('expDoc')),
          'second'
        ),
      }
    )
  );
  return experience;
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
  const sTimeStamp = q.ToTime(q.Date(startDate));
  const eTimeStamp = endDate !== undefined ? q.ToTime(q.Date(endDate)) : null;
  const companyRef = await getCompanyByName(company);

  return client.query(
    q.Create(q.Collection('experiences'), {
      data: {
        title,
        company: companyRef,
        description,
        employmentType,
        user,
        // convert dates to epoch times in the form of
        // (eg. 1230728400)
        startDate: sTimeStamp,
        // endDate might be null, so we only convert to epoch time
        // if it is not null, otherwise just return null
        endDate: q.If(q.Equals(eTimeStamp, null), null, eTimeStamp),
      },
    })
  );
}

export async function updateExperience(experienceID, update) {
  return client.query(
    q.Update(q.Ref(q.Collection('experiences'), experienceID), {
      data: update,
    })
  );
}

export async function deleteExperience(experienceID) {
  return client.query(
    q.Delete(q.Ref(q.Collection('experiences'), experienceID))
  );
}
