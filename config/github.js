import dotenv from 'dotenv';

dotenv.config();

export default {
  CLIENT_ID: '623db91f2020120f6c63',
  TOKEN_URL: 'https://github.com/login/oauth/access_token',
  CLIENT_SECRET: process.env.GITHUB_SECRET,
};
