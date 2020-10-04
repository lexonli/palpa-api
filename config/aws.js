import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_IMAGE_BUCKET: process.env.AWS_BUCKET,
  S3_EXPIRE_SECONDS: 60 * 5,
};
