import express from 'express';
import { getAllTemplates, getTemplate } from '../controllers/template.js';
import { handleNotFoundError } from '../utils/fauna.js';

const router = express.Router();

router.get('/:template', async (req, res) => {
  const templateId = req.params.template;
  try {
    const template = await getTemplate(templateId);
    await res.status(200).json(template);
  } catch (error) {
    handleNotFoundError(error, res, 'Template does not exist');
  }
});

router.get('/', async (req, res) => {
  try {
    const templates = await getAllTemplates();
    await res.status(200).json(templates);
  } catch (error) {
    await res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
});

export default router;
