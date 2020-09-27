import { getProject } from '../controllers/project';

async function getUserIDFromProjectID(projectID) {
  const project = await getProject(projectID);
  return project.user;
}

function getUserID(IDType) {
  return async (req, res, next) => {
    let documentID = '';
    if (IDType === 'projectID') {
      documentID = req.query.project;
    }
    // Extract userID
    let userID = '';
    try {
      userID = await getUserIDFromProjectID(documentID);
      req.userID = userID;
      next();
    } catch (err) {
      await res.status(400).json({
        errors: [{ message: 'Error while fetching project.' }],
      });
    }
  };
}

export default getUserID;
