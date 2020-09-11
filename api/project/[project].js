import proto from '../../utils/proto';
import { getProject } from '../../controllers/project';

const router = proto();

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
        errors: [{ message: error.toString() }],
      })
    );
});

export default router;
