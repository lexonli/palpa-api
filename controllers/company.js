import faunadb from 'faunadb';
import client from '../config/client.js';

const { query: q } = faunadb;

function createCompany(name, imageURL) {
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

export async function getCompaniesByQuery(query) {
  const companies = await client.query(
    q.Map(
      q.Filter(
        q.Paginate(q.Match(q.Index('company_name_and_ref')), { size: 10000 }),
        q.Lambda(
          ['name', 'ref'],
          q.ContainsStr(q.LowerCase(q.Var('name')), query)
        )
      ),
      q.Lambda(
        'company',
        q.Select(['data'], q.Get(q.Select(1, q.Var('company'))))
      )
    )
  );
  return companies.data;
}
