import proto from '../../utils/proto';
import {
  getExperience,
  deleteExperience,
  updateExperience,
} from '../../controllers/experience';
import { handleNotFoundError } from '../../utils/fauna';
import validator from '../../middleware/validator';
import getUserID from '../../middleware/getUserID';
import validateToken from '../../middleware/validateToken';
import { experienceUpdateSchema } from '../../models/expereince';
import optionalAuth from '../../middleware/optionalAuth';
import auth from '../../middleware/auth';

const router = proto();

router.get(optionalAuth, async (req, res) => {
  const experienceID = req.query.experience;
  try {
    const experience = await getExperience(experienceID);
    await res.status(200).json({
      experience,
    });
  } catch (error) {
    handleNotFoundError(error, res, 'Project does not exist');
  }
});

router.patch(
  auth,
  getUserID('experienceID'),
  validateToken,
  validator(experienceUpdateSchema),
  async (req, res) => {
    try {
      const experienceID = req.query.experience;
      await updateExperience(experienceID, req.body);
      res.status(200).send();
    } catch (error) {
      handleNotFoundError(error, res, 'Given project does not exist');
    }
  }
);

router.delete(
  auth,
  getUserID('experienceID'),
  validateToken,
  async (req, res) => {
    try {
      const experienceID = req.query.experience;
      await deleteExperience(experienceID);
      res.status(200).send();
    } catch (error) {
      handleNotFoundError(error, res, 'Given project does not exist');
    }
  }
);

export default router;
