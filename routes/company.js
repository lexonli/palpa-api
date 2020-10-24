import express from 'express';
import { getCompaniesByQuery } from '../controllers/company.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { query } = req.query;
  try {
    const companies = await getCompaniesByQuery(query);
    await res.status(200).json(companies);
  } catch (error) {
    await res.status(400).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;
