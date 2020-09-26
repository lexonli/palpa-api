import proto from '../../utils/proto';
import { deleteExperience } from '../../controllers/experience';
import { handleNotFoundError } from '../../utils/fauna';

const router = proto();

router.delete(async (req, res) => {
  try {
    const experienceID = req.query.experience;
    await deleteExperience(experienceID);
    res.status(200).send();
  } catch (error) {
    handleNotFoundError(error, res, 'Given project does not exist');
  }
});

export default router;
