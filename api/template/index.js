import proto from '../../utils/proto'
import { getAllTemplates } from '../../controllers/template';

const router = proto();

router.get(async (req, res) => {
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
