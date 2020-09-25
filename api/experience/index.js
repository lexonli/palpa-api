import proto from '../../utils/proto';
import validator from '../../middleware/validator';
import createExperience from '../../controllers/experience';
// // import { usernameSchema } from '../../models/user';
import experienceSchema from '../../models/expereince';
// // import optionalAuth from '../../middleware/optionalAuth';
// // import { handleNotFoundError } from '../../utils/fauna';
// // import auth from '../../middleware/auth';

const router = proto();

router.post(validator(experienceSchema), async (req, res) => {
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

export default router;
