import dotenv from 'dotenv';

dotenv.config();

import faunadb from 'faunadb';

const secret =
  process.env.NODE_ENV === 'PROD'
    ? process.env.FAUNADB_SECRET_KEY_PROD
    : process.env.FAUNADB_SECRET_KEY_TEST;
const client = new faunadb.Client({ secret });

export const rememberMeDays = 7;
export const noRememberMeDays = 1;

export default client;
