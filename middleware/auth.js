function auth(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const [, token] = bearerHeader.split(' ');
    req.token = token;
    next();
  } else {
    res.status(403).json({
      errors: [{ message: 'No authentication token provided' }],
    });
  }
}

export default auth;
