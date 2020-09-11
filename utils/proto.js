import nc from 'next-connect';
import helmet from 'helmet';
import cors from '../middleware/cors';

export default function proto() {
  const router = nc();
  router.use(helmet());
  router.use(cors);
  return router;
}
