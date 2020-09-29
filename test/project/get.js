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
describe('Test the get endpoint of Project API', function () {
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

  // eslint-disable-next-line no-undef
  before('Create test instance(s)', async function () {
    const res = await chai
      .request(apiUrl)
      .post('/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'toBeDeleted',
        username: cred.username,
        pageData: { quote: 'a wise quote' },
        isPublished: true,
        views: 0,
      });
    projectID = res.body;
  });

  it('200, Get project data by project ID with valid ID', function (done) {
    chai
      .request(apiUrl)
      .get(`/project/${projectID}`)
      .set('content-type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.contain.property('project');
        done();
      });
  });

  it('400, Get project data by project ID with non-existent ID', function (done) {
    const wrongProjectID = '2739046';
    chai
      .request(apiUrl)
      .get(`/project/${wrongProjectID}`)
      .set('content-type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.contain.property('errors');
        done();
      });
  });

  it('200, Get list of projects by username with existing username', function (done) {
    const username = 'lex';
    chai
      .request(apiUrl)
      .get('/project')
      .set('content-type', 'application/json')
      .query({ username })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.contain.property('projects');
        done();
      });
  });

  it('400, Get list of projects by username with non-existent username', function (done) {
    const nonExistentUsername = 'lex102398742386';
    chai
      .request(apiUrl)
      .get('/project')
      .set('content-type', 'application/json')
      .query({ username: nonExistentUsername })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.contain.property('errors');
        done();
      });
  });
});
