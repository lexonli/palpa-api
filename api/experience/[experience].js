import proto from '../../utils/proto';
import {
  deleteExperience,
  updateExperience,
} from '../../controllers/experience';
import { handleNotFoundError } from '../../utils/fauna';
import validator from '../../middleware/validator';
import { experienceUpdateSchema } from '../../models/expereince';
import auth from '../../middleware/auth';

const router = proto();

router.patch(auth, validator(experienceUpdateSchema), async (req, res) => {
  try {
    const experienceID = req.query.experience;
    await updateExperience(experienceID, req.body);
    res.status(200).send();
  } catch (error) {
    handleNotFoundError(error, res, 'Given project does not exist');
  }
});

router.delete(auth, async (req, res) => {
  try {
    const experienceID = req.query.experience;
    await deleteExperience(experienceID);
    res.status(200).send();
  } catch (error) {
    handleNotFoundError(error, res, 'Given project does not exist');
  }
});

export default router;
