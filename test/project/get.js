require('../globalSetup');
// path and dotenv are used to ensure .env variables are defined
const path = require('path');

const dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath });

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

chai.use(chaiHttp);

// template for a unittest
// it('', function (done) {});
const apiUrl = process.env.API_URL;
describe('Test the get endpoint of project api', function () {
  // disable timeouts so API tests can run till the end without being dropped
  this.timeout(0);
  it('200, Get project data by project ID with valid ID', function (done) {
    const projectID = '276897576184185352';
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

  it('400, Get project data by project ID with non-existant ID', function (done) {
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

  it('400, Get list of projects by username with non-existant username', function (done) {
    const nonExistantUsername = 'lex102398742386';
    chai
      .request(apiUrl)
      .get('/project')
      .set('content-type', 'application/json')
      .query({ username: nonExistantUsername })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.contain.property('errors');
        done();
      });
  });
});
