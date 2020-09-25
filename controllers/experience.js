import { query as q } from 'faunadb';
import { getUserFromUsername } from './user';
import client from '../config/client';
import { getCompanyByName } from './company';

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
  const sDate = q.Date(startDate);
  const eDate = q.Date(endDate);
  const companyRef = await getCompanyByName(company);

  return client
    .query(
      q.Create(q.Collection('experiences'), {
        data: {
          title,
          company: companyRef,
          description,
          employmentType,
          user,
          startDate: sDate,
          endDate: eDate,
        },
      })
    )
    .catch((err) => {
      throw err;
    });
}
