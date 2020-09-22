import { getProject } from '../controllers/project';
import { getUserIDFromToken } from '../utils/fauna';

async function validateToken(req, res, next) {
  const projectId = req.query.project;
  const project = await getProject(projectId);
  const userID = project.user;

  // The previous middleware should've added token to the req
  try {
    const user = await getUserIDFromToken(req.token);
    if (userID !== user.id) {
      res.status(403).json({ success: false, message: 'Token is invalid' });
    }
  } catch (err) {
    res
      .status(403)
      .json({ success: false, message: 'Non-existant token received' });
  }

  next();
}

export default validateToken;
