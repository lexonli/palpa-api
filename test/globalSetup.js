/* eslint-disable no-undef */

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

async function createTestUser(username, name, email, password) {
  chai
    .request(process.env.API_URL)
    .post('/user')
    .set('content-type', 'application/json')
    .send({
      username,
      name,
      email,
      password,
    })
    .catch(function (err) {});
}

before('Switch the node environment to TEST', function () {
  process.env.NODE_ENV = 'TEST';
});

before('Create test user 1 and 2', async function () {
  this.timeout(0);
  await createTestUser('testUser', 'test user', 'test1@gmail.com', 'swaggy');
  await createTestUser(
    'testUser2',
    'test user jr',
    'test2@gmail.com',
    'swaggy'
  );
});

after('Switch the node environment back to PROD', function () {
  process.env.NODE_ENV = 'PROD';
});
