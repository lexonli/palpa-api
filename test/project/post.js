const path = require('path');

const dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath });

const axios = require('axios');
const { expect } = require('chai');

// template for a unittest
// it('', function () {});
const apiUrl = process.env.API_URL;
describe('Test the create endpoint of project api', function () {
  // disable timeouts
  this.timeout(0);

  it('create api should return status code 200 with valid request body', async function () {
    const res = await axios({
      method: 'post',
      url: `${apiUrl}/project`,
      data: {
        name: 'palpa12',
        username: 'lex',
        pageData: { quote: 'a wise quote' },
        isPublished: true,
        views: 0,
      },
    });
    expect(res.status).to.equal(200);
  });
});
