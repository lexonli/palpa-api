import nc from 'next-connect';
import cors from '../../middleware/cors';
import { getProject } from '../../controllers/project';

const router = nc();
router.use(cors);

router.get((req, res) => {
  const projectId = req.query.project;
  getProject(projectId)
    .then((project) => {
      res.status(200).json({
        project,
      });
    })
    .catch((error) =>
      res.status(400).json({
        errors: [{ message: error.description }],
      })
    );
});

export default router;
