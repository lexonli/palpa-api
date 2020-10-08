import faunadb from 'faunadb';
import client from '../config/client.js';

const { query: q } = faunadb;

export async function sanitizedOneUserRef(document) {
  const { data } = document;
  data.user = data.user.id;
  data.lastChanged = await client.query(
    q.TimeDiff(q.Epoch(0, 'second'), data.lastChanged, 'second')
  );
  data.dateCreated = await client.query(
    q.TimeDiff(q.Epoch(0, 'second'), data.dateCreated, 'second')
  );
  return data;
}

export async function sanitizedAllUserRef(documents) {
  return Promise.all(
    documents.map(async (document) => {
      const { data } = document;
      data.user = data.user.id;
      data.id = document.ref.id;
      data.lastChanged = await client.query(
        q.TimeDiff(q.Epoch(0, 'second'), data.lastChanged, 'second')
      );
      data.dateCreated = await client.query(
        q.TimeDiff(q.Epoch(0, 'second'), data.dateCreated, 'second')
      );
      return data;
    })
  );
}
