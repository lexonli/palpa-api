import faunadb from 'faunadb';
const { query: q } = faunadb;
import client from '../config/client.js';

export default function createCompany(name, imageURL) {
  return client
    .query(
      q.Create(q.Collection('companies'), {
        data: {
          name,
          imageURL,
        },
      })
    )
    .catch((err) => {
      throw err;
    });
}

export async function getCompanyByName(name) {
  let company;
  try {
    company = await client.query(
      q.Get(q.Match(q.Index('company_by_name'), name))
    );
  } catch (err) {
    company = await createCompany(name, undefined);
  }

  return company.ref;
}
