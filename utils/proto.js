import nc from 'next-connect';
import helmet from 'helmet';

export default function proto() {
  const router = nc();
  router.use(helmet());
  return router;
}
