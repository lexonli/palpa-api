import proto from '../../utils/proto';
// // import validator from '../../middleware/validator';
// // import { usernameSchema } from '../../models/user';
// // import experienceSchema from '../../models/expereince';
// // import optionalAuth from '../../middleware/optionalAuth';
// // import { handleNotFoundError } from '../../utils/fauna';
// // import auth from '../../middleware/auth';

// const router = proto();

// // TODO: Implement token validation

// router.post(async (req, res) => {
//   console.log('a');
//   try {
//     // const { title, employmentType, username, startDate } = req.body;
//     // save the project to fauna
//     // const project = await createExperience(
//     //   title,
//     //   username,
//     //   employmentType,
//     //   startDate
//     // );
//     // await res.status(200).json(project.ref.id);
//     // await res.status(200).json(title, employmentType, username, startDate);
//     return res.status(200);
//   } catch (error) {
//     await res.status(500).json({
//       errors: [{ message: error.toString() }],
//     });
//   }
// });

const router = proto();

router.post(async (req, res) => {
  try {
    const { title, employmentType, username, startDate } = req.body;
    await res.status(200).json(title);
  } catch (err) {
    await res.status(500).json({
      errors: [{ message: err.toString() }],
    });
  }
});

export default router;
