import nc from 'next-connect';
import AWS from 'aws-sdk';
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

const router = nc();
router.use(cors);

router.post((req, res) => {
  const { body } = req;

  const key = body.filename;
  const contentType = body.filetype;
  let signed = null;
  try {
    signed = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      Expires: signedUrlExpireSeconds,
      ACL: 'public-read',
    });
  } catch (e) {
    res.status(400).json({ message: e.toString() });
    return;
  }
  res
    .status(200)
    .json({ url: signed.substring(0, signed.indexOf('?')), signedUrl: signed });
});

module.exports = router;
