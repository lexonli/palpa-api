import AWS from 'aws-sdk';

import config from '../config/aws.js';

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'ap-southeast-2',
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY,
});

const bucketName = config.S3_IMAGE_BUCKET;
const signedUrlExpireSeconds = config.S3_EXPIRE_SECONDS;

/**
 * Makes a request to S3 api with the preset AWS IAM credentials to obtain
 * - a signed url
 * The signed url allows the client to make a PUT request to the designated S3
 * - bucket with a file of designated type
 * @param {string} filename - name of file stored in S3
 * @param {string} filetype - designated file type
 * @returns {string}
 * - Promise with document ref if successful
 */
export default function sign(filename, filetype) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: filename,
    ContentType: filetype,
    Expires: signedUrlExpireSeconds,
    ACL: 'public-read',
  });
}
