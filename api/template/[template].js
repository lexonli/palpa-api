import proto from '../../utils/proto';
import { getTemplate } from '../../controllers/template';
import { handleNotFoundError } from '../../utils/fauna';

const router = proto();

router.get(async (req, res) => {
  const templateId = req.query.template;
  try {
    const template = await getTemplate(templateId);
    await res.status(200).json(template);
  } catch (error) {
    handleNotFoundError(error, res, 'Template does not exist');
  }
});

export default router;
