/* eslint-disable no-undef */

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

before('Switch the node environment to TEST', function () {
  console.log('a');
  process.env.NODE_ENV = 'TEST';
});

before('Create test user', async function () {
  this.timeout(0);
  console.log('b');
  await chai
    .request(process.env.API_URL)
    .post('/user')
    .set('content-type', 'application/json')
    .send({
      username: 'testUser',
      name: 'test user',
      email: 'test@gmail.com',
      password: 'swaggy',
    })
    .catch(function (err) {
      console.log(err);
    });
});

after('Switch the node environment back to PROD', function () {
  process.env.NODE_ENV = 'PROD';
});
