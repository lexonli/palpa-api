import proto from '@peterjskaltsis/proto';
import AWS from 'aws-sdk';
import { S3_IMAGE_BUCKET, S3_EXPIRE_SECONDS } from '../../config/aws';
import FRONTEND from '../../config/frontend';

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'ap-southeast-2',
});
// AWS.config.update({
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY,
// });

const bucketName = S3_IMAGE_BUCKET;
const signedUrlExpireSeconds = S3_EXPIRE_SECONDS;

const router = proto();

router.post((req, res) => {
  // To move to middleware
  const body = JSON.parse(req.body);
  res.setHeader('Access-Control-Allow-Origin', FRONTEND.ROOT);

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
