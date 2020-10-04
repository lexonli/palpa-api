import express from 'express';
import sign from '../controllers/file.js';
import validator from '../middleware/validator.js';
import { imageSchema } from '../models/s3.js';

const router = express.Router();

/**
 * Get a signed url for image upload
 */
router.post('/presign', validator(imageSchema), (req, res) => {
  try {
    const signed = sign(req.body.filename, req.body.filetype);
    res.status(200).json({
      url: signed && signed.substring(0, signed.indexOf('?')),
      signedUrl: signed,
    });
  } catch (e) {
    res.status(400).json({ errors: [{ message: e.toString() }] });
  }
});

export default router;
