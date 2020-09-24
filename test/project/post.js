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
// it('', function () {});
const apiUrl = process.env.API_URL;
describe('Test the create endpoint of project api', function () {
  // disable timeouts so API tests can run till the end without being dropped
  this.timeout(0);

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
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: cred.email,
        password: cred.pwd,
      });
    token = res.body.token;
  });

  it('create api should return status code 200 with valid request body', function (done) {
    chai
      .request(apiUrl)
      .post('/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'palpa 12',
        username: 'lex',
        pageData: { quote: 'a wise quote' },
        isPublished: true,
        views: 0,
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('create api should return status code 400 with erroneous request body', function (done) {
    chai
      .request(apiUrl)
      .post('/project')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nname: 'palpa 12',
        uusername: 'lex',
        pageDataa: { quote: 'a wise quote' },
        iisPublished: true,
        viewss: 0,
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
});
