/* eslint-disable no-undef */
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
describe('Test the patch endpoint of project api', function () {
  // disable timeouts so API tests can run till the end without being dropped
  this.timeout(0);

  let projectID = '';
  const invalidProjectID = '276256';
  let token = '';
  let tokenOfAnotherUser = '';
  const invalidToken = 'lexisagoodygoodyboi';
  const cred = {
    username1: 'testUser',
    email1: 'test1@gmail.com',
    username2: 'testUser2',
    email2: 'test2@gmail.com',
    pwd: 'swaggy',
  };

  before('Create test instance(s)', async function () {
    const res = await chai
      .request(apiUrl)
      .post('/project')
      .set('content-type', 'application/json')
      .send({
        name: 'testGet',
        username: 'testUser',
        pageData: { quote: 'a wise quote' },
        isPublished: true,
        views: 0,
      });
    projectID = res.body;
  });

  before('Fetch fresh tokens for two users', async function () {
    let res = await chai
      .request(apiUrl)
      .post('/user/login')
      .set('content-type', 'application/json')
      .send({
        email: cred.email1,
        password: cred.pwd,
      });
    token = res.body.token;

    res = await chai
      .request(apiUrl)
      .post('/user/login')
      .set('content-type', 'application/json')
      .send({
        email: cred.email2,
        password: cred.pwd,
      });
    tokenOfAnotherUser = res.body.token;
  });

  const content = {
    pageData: {
      type: 'block-quote',
      children: [
        {
          text: 'This is my UPDATEDDD project! Lex is a goody goody boi ;)',
        },
      ],
    },
  };
  const invalidContent = {
    pageDataaa: {
      type: 'block-quote',
      children: [
        {
          text: 'This is my UPDATEDDD project! Lex is a goody goody boi ;)',
        },
      ],
    },

    type: 'anime',
  };

  it('200, update project with valid ID and valid content', function (done) {
    chai
      .request(apiUrl)
      .patch(`/project/${projectID}`)
      .set('content-type', 'application/json')
      .auth('token', token)
      .send(content)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('400, update project with invalid ID and valid content', function (done) {
    chai
      .request(apiUrl)
      .patch(`/project/${invalidProjectID}`)
      .set('content-type', 'application/json')
      .auth('token', token)
      .send(content)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.contain.property('errors');
        done();
      });
  });

  it('400, update project with valid ID and invalid content', function (done) {
    chai
      .request(apiUrl)
      .patch(`/project/${projectID}`)
      .set('content-type', 'application/json')
      .auth('token', token)
      .send(invalidContent)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.contain.property('errors');
        done();
      });
  });

  it('400, update project with invalid ID and invalid content', function (done) {
    chai
      .request(apiUrl)
      .patch(`/project/${invalidProjectID}`)
      .set('content-type', 'application/json')
      .auth('token', token)
      .send(invalidContent)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.contain.property('errors');
        done();
      });
  });

  it('403, update project without passing a token', function (done) {
    chai
      .request(apiUrl)
      .patch(`/project/${projectID}`)
      .set('content-type', 'application/json')
      .send(content)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('403, update project with an invalid token', function (done) {
    chai
      .request(apiUrl)
      .patch(`/project/${projectID}`)
      .set('content-type', 'application/json')
      .auth('token', invalidToken)
      .send(content)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('403, update project with a token that does not belong to the user', function (done) {
    chai
      .request(apiUrl)
      .patch(`/project/${projectID}`)
      .set('content-type', 'application/json')
      .auth('token', tokenOfAnotherUser)
      .send(content)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });
});
