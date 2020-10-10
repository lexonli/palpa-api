import express from 'express';
import createExperience, {
  getExperience,
  deleteExperience,
  updateExperience,
} from '../controllers/experience.js';
import { handleNotFoundError } from '../utils/fauna.js';
import validator from '../middleware/validator.js';
import getUserID from '../middleware/getUserID.js';
import validateToken from '../middleware/validateToken.js';
import experienceSchema, {
  experienceUpdateSchema,
} from '../models/experience.js';
import optionalAuth from '../middleware/optionalAuth.js';
import auth from '../middleware/auth.js';
import { removeExperienceFromUser } from "../controllers/user";

const router = express.Router();

router.post('/', auth, validator(experienceSchema), async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      employmentType,
      username,
      startDate,
      endDate,
    } = req.body;
    const experience = await createExperience(
      title,
      company,
      description,
      employmentType,
      username,
      startDate,
      endDate
    );
    await res.status(200).json(experience.ref.id);
  } catch (err) {
    await res.status(500).json({
      errors: [{ message: err.toString() }],
    });
  }
});

router.get('/:experience', optionalAuth, async (req, res) => {
  const experienceID = req.params.experience;
  try {
    const experience = await getExperience(experienceID);
    await res.status(200).json({
      experience,
    });
  } catch (error) {
    handleNotFoundError(error, res, 'Experience does not exist');
  }
});

router.patch(
  '/:experience',
  auth,
  getUserID('experienceID'),
  validateToken,
  validator(experienceUpdateSchema),
  async (req, res) => {
    try {
      const experienceID = req.params.experience;
      await updateExperience(experienceID, req.body);
      res.status(200).send();
    } catch (error) {
      handleNotFoundError(error, res, 'Given experience does not exist');
    }
  }
);

router.delete(
  '/:experience',
  auth,
  getUserID('experienceID'),
  validateToken,
  async (req, res) => {
    try {
      const experienceID = req.params.experience;
      await removeExperienceFromUser(req.userID, experienceID);
      await deleteExperience(experienceID);
      res.status(200).send();
    } catch (error) {
      handleNotFoundError(error, res, 'Given experience does not exist');
    }
  }
);

export default router;
