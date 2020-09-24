import { getProject } from '../controllers/project';
import { getUserIDFromToken } from '../utils/fauna';

async function getUserIDFromProjectID(projectID) {
  const project = await getProject(projectID);
  return project.user;
}

async function validateToken(req, res, next) {
  if (req.token) {
    // The previous middleware should've added token to the req
    const projectID = req.query.project;
    let userID = '';
    try {
      userID = await getUserIDFromProjectID(projectID);
    } catch (err) {
      await res.status(400).json({
        errors: [{ message: 'Error while fetching project.' }],
      });
    }

    try {
      const user = await getUserIDFromToken(req.token);
      if (userID !== user.id) {
        await res.status(403).json({
          errors: [{ message: 'Your token cannot access this resource.' }],
        });
      }
      next();
    } catch (err) {
      await res.status(403).json({
        errors: [{ message: 'Non-existent token received' }],
      });
    }
  }
}

export default validateToken;
