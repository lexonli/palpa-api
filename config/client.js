import dotenv from 'dotenv';

import faunadb from 'faunadb';

dotenv.config();

const secret =
  process.env.NODE_ENV === 'PROD'
    ? process.env.FAUNADB_SECRET_KEY_PROD
    : process.env.FAUNADB_SECRET_KEY_TEST;
const client = new faunadb.Client({ secret });

export const rememberMeDays = 7;
export const noRememberMeDays = 1;

export default client;
