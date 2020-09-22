import nextConnect from 'next-connect';

function validateToken(req, res, next) {
  console.log('validating token');
  next();
}

export default validateToken;
