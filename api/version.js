import handler from '../utils/proto'

const router = handler()

router.get((req, res) => {
  return res.status(200).json({ success: true, version: '1.0.0' })
});

module.exports = router