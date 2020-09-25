import { query as q } from 'faunadb';
import { getUserFromUsername } from './user';
import client from '../config/client';

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
  return client
    .query(
      q.Create(q.Collection('experiences'), {
        data: {
          title,
          company,
          description,
          employmentType,
          user,
          startDate,
          endDate,
        },
      })
    )
    .catch((err) => {
      throw err;
    });
}
