import { getProject } from '../controllers/project';
import { getUserIDFromToken } from '../utils/fauna';

async function getUserIDFromProjectID(projectID) {
  const project = await getProject(projectID);
  const userID = project.user;
  return userID;
}

async function validateToken(req, res, next) {
  if (req.token !== undefined) {
    // The previous middleware should've added token to the req
    const projectID = req.query.project;
    let userID = '';
    try {
      userID = await getUserIDFromProjectID(projectID);
    } catch (err) {
      // console.log(err);
      res
        .status(400)
        .json({ success: false, message: 'Error while fetching project.' });
    }

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
  }
  next();
}

export default validateToken;
