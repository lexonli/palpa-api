import proto from '../utils/proto';

const router = proto();

router.get((req, res) => {
  return res.status(200).json({ success: true, version: '1.0.0' });
});

export default router;
