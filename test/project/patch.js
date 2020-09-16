const path = require('path');

const dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath });

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const { invalid } = require('joi');

chai.use(chaiHttp);

// template for a unittest
// it('', function (done) {});
const apiUrl = process.env.API_URL;
describe('Test the patch endpoint of project api', function () {
  // disable timeouts
  this.timeout(0);

  const projectID = '276256822060384780';
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

  //   it('200, update project with valid ID and valid content', function (done) {
  //     chai
  //       .request(apiUrl)
  //       .patch(`/project/${projectID}`)
  //       .set('content-type', 'application/json')
  //       .send(content)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(200);
  //         console.log(res);
  //         done();
  //       });
  //   });

  //   it('400, update project with invalid ID and valid content', function (done) {
  //     chai
  //       .request(apiUrl)
  //       .patch(`/project/${invalidProjectID}`)
  //       .set('content-type', 'application/json')
  //       .send(content)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         expect(res.body).to.contain.property('errors');
  //         done();
  //       });
  //   });

  //   it('400, update project with valid ID and invalid content', function (done) {
  //     chai
  //       .request(apiUrl)
  //       .patch(`/project/${projectID}`)
  //       .set('content-type', 'application/json')
  //       .send(invalidContent)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         expect(res.body).to.contain.property('errors');
  //         done();
  //       });
  //   });

  //   it('400, update project with invalid ID and invalid content', function (done) {
  //     chai
  //       .request(apiUrl)
  //       .patch(`/project/${invalidProjectID}`)
  //       .set('content-type', 'application/json')
  //       .send(invalidContent)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         expect(res.body).to.contain.property('errors');
  //         done();
  //       });
  //   });

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

  //   it('403, update project with a token that does not belong to the user', function (done) {
  //     chai
  //       .request(apiUrl)
  //       .patch(`/project/${projectID}`)
  //       .set('content-type', 'application/json')
  //       .send(content)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(200);
  //         console.log(res);
  //         done();
  //       });
  //   });
});
