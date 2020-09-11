import nc from 'next-connect'
import cors from '../../middleware/cors'
import { getUserFromUsername } from '../../controllers/user'
import { getProjectsFromUserId } from '../../controllers/project'
import validator from '../../middleware/validator'
import { usernameSchema } from '../../models/user'
import { projectSchema } from '../../models/project'

const router = nc()
router.use(cors)

router.get(validator(usernameSchema, 'query'), (req, res) => {
  const { username } = req.query
  getUserFromUsername(username)
    .then((user) => getProjectsFromUserId(user))
    .then((projects) =>
      res.status(200).json({
        projects,
      }),
    )
    .catch((error) =>
      res.status(400).json({
        errors: [{ message: error.toString() }],
      }),
    )
})

router.post((req, res) => {
  const { projectName } = req.query
  // Check if project name is available
  res.status(200).json(projectName)
  // save the project to fauna
})

export default router
