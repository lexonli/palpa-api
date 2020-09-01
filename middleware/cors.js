function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next()
}

export default cors;