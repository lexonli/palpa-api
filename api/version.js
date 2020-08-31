import nc from 'next-connect';

const router = nc();

router.get((req, res) => {
  return res.status(200).json({ success: true, version: '1.0.0' });
});

export default router;
