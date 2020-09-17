require('../globalSetup');
// path and dotenv are used to ensure .env variables are defined
const path = require('path');

const dotEnvPath = path.resolve('./.env');
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

  const projectID = '276897576184185352';
  const token = 'fnED178UMFACCAPXsKpQwAYISBUUH-0oSet1PF9U1uiouUnAFvQ';
  const tokenOfAnotherUser =
    'fnED16DqPdACDQPNEHYtkAYMaQpgZ4uU5aKy1yesi2d2lRZdyWI';
  const invalidToken = 'lexisagoodygoodyboi';
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

  const invalidProjectID = '276256';
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
