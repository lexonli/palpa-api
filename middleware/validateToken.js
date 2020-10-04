import { getUserIDFromToken } from '../utils/fauna.js';

async function validateToken(req, res, next) {
  // The previous middleware should've added token to the req
  if (req.token) {
    try {
      const user = await getUserIDFromToken(req.token);
      if (req.userID !== user.id) {
        await res.status(403).json({
          errors: [{ message: 'Your token cannot access this resource.' }],
        });
      }
      next();
    } catch (err) {
      await res.status(403).json({
        errors: [{ message: 'Non-existent token received' }],
      });
    }
  }
}

export default validateToken;
