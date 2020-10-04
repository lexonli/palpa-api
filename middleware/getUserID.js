import { getProject } from '../controllers/project.js';
import { getExperience } from '../controllers/experience.js';

async function getUserIDFromProjectID(projectID) {
  const project = await getProject(projectID);
  return project.user;
}

async function getUserIDFromExperienceID(experienceID) {
  const experience = await getExperience(experienceID);
  return experience.user;
}

function getUserID(IDType) {
  return async (req, res, next) => {
    try {
      let userID = '';
      if (IDType === 'projectID') {
        userID = await getUserIDFromProjectID(req.query.project);
      } else if (IDType === 'experienceID') {
        userID = await getUserIDFromExperienceID(req.query.experience);
      }
      req.userID = userID;
      // Make sure a valid user ID is actually extracted
      if (req.userID === '') {
        await res.status(400).json({
          errors: [{ message: 'User ID extraction failed' }],
        });
      }
      next();
    } catch (err) {
      await res.status(400).json({
        errors: [{ message: 'Error while getting user ID' }],
      });
    }
  };
}

export default getUserID;
