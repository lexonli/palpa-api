function verifyToken(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const [, token] = bearerHeader.split(' ');
    req.token = token;
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: 'No authentication token provided' });
  }
}

export default verifyToken;