function optionalAuth(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const [, token] = bearerHeader.split(' ');
      req.token = token;
      next();
    } else {
      next()
    }
}

export default optionalAuth;
