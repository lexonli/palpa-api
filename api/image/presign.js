import nc from 'next-connect';
import sign from '../../controllers/file';
import cors from '../../middleware/cors';
import validator from '../../middleware/validator';
import { imageSchema } from '../../models/s3';

const router = nc();
router.use(cors);

/**
 * Get a signed url for image upload
 */
router.post(validator(imageSchema), (req, res) => {
  try {
    const signed = sign(req.body.filename, req.body.filetype);
    res.status(200).json({
      url: signed && signed.substring(0, signed.indexOf('?')),
      signedUrl: signed,
    });
  } catch (e) {
    res.status(400).json({ message: e.toString() });
  }
});

module.exports = router;
