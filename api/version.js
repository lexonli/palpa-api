import proto from "@peterjskaltsis/proto";

const router = proto();

router.get((req, res) => {
  return res.status(200).json({ success: true, version: '1.0.0' })
})

module.exports = router
