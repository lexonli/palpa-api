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
describe('Test the create endpoint of project api', function () {
  // disable timeouts
  this.timeout(0);
  it('Get project data by project ID with valid ID', function (done) {
    const projectID = '273904644720165389';
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
});
