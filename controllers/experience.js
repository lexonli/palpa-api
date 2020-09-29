import { query as q } from 'faunadb';
import { getUserFromUsername } from './user';
import client from '../config/client';
import { getCompanyByName } from './company';
import { sanitizedOne } from './utils';

export async function getExperience(experienceID) {
  const experience = await client.query(
    q.Get(q.Ref(q.Collection('experiences'), experienceID))
  );
  return sanitizedOne(experience);
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
        startDate: q.TimeDiff(q.Epoch(0, 'second'), sTimeStamp, 'second'),
        // endDate might be null, so we only convert to epoch time
        // if it is not null, otherwise just return null
        endDate: q.If(
          q.Equals(eTimeStamp, null),
          null,
          q.TimeDiff(q.Epoch(0, 'second'), eTimeStamp, 'second')
        ),
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
