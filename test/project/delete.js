require('../globalConfig');
// path and dotenv are used to ensure .env variables are defined
const path = require('path');

const dotEnvPath = path.resolve('./test.env');
require('dotenv').config({ path: dotEnvPath });

// import for unittests
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

chai.use(chaiHttp);

// template for a unittest
// it('', function (done) {});
const apiUrl = process.env.API_URL;
describe('Test the delete endpoint of project api', function () {
  // disable timeouts so API tests can run till the end without being dropped
  this.timeout(0);
  let projectID = '';
  let token = '';
  const cred = {
    username: 'testUser',
    email: 'test1@gmail.com',
    pwd: 'swaggy',
  };

  // eslint-disable-next-line no-undef
  before('Create test instance(s)', async function () {
    const res = await chai
      .request(apiUrl)
      .post('/project')
      .set('content-type', 'application/json')
      .send({
        name: 'toBeDeleted',
        username: cred.username,
        pageData: { quote: 'a wise quote' },
        isPublished: true,
        views: 0,
      });
    projectID = res.body;
  });

  // eslint-disable-next-line no-undef
  before('Fetch fresh tokens for user', async function () {
    const res = await chai
      .request(apiUrl)
      .post('/user/login')
      .set('content-type', 'application/json')
      .send({
        email: cred.email,
        password: cred.pwd,
      });
    token = res.body.token;
  });

  it('200, successfully deleting a project', function (done) {
    chai
      .request(apiUrl)
      .delete(`/project/${projectID}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('400, attemp to delete a project that does not exist, or has been deleted', function (done) {
    chai
      .request(apiUrl)
      .delete(`/project/${projectID}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
});
