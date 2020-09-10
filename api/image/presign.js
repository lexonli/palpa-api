import nc from 'next-connect';
import AWS from 'aws-sdk';
import assert from 'assert';
import cors from '../../middleware/cors';
import { S3_IMAGE_BUCKET, S3_EXPIRE_SECONDS } from '../../config/aws';

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'ap-southeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
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
function sign(filename, filetype) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: filename,
    ContentType: filetype,
    Expires: signedUrlExpireSeconds,
    ACL: 'public-read',
  });
}

const router = nc();
router.use(cors);

/**
 * Get a signed url for image upload
 */
router.post((req, res) => {
  const { body } = req;
  try {
    assert(
      body.filetype.indexOf('image/') === 0,
      'filetype requested is not an image'
    );
    const signed = sign(body.filename, body.filetype);
    res.status(200).json({
      url: signed && signed.substring(0, signed.indexOf('?')),
      signedUrl: signed,
    });
  } catch (e) {
    res.status(400).json({ message: e.toString() });
  }
});

module.exports = router;
