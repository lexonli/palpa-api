import AWS from 'aws-sdk';

import {
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_IMAGE_BUCKET,
  S3_EXPIRE_SECONDS,
} from '../config/aws';

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'ap-southeast-2',
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
});

const bucketName = S3_IMAGE_BUCKET;
const signedUrlExpireSeconds = S3_EXPIRE_SECONDS;

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
