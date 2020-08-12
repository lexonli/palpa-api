import proto from '@peterjskaltsis/proto'

const router = proto()

router.get((req, res) => {
  return res.status(200).send(`Welcome to Palpa API! Hope you enjoy your time here ;)`)
});

module.exports = router