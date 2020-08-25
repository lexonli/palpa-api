import proto from '@peterjskaltsis/proto';
import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, TOKEN_URL } from '../../../config/github';

const router = proto();

function parseParams(str) {
  const keyValues = str.split('&');
  const params = {};
  keyValues.forEach((keyValue) => {
    const [key, value] = keyValue.split('=');
    params[key] = value;
  });
  return params;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function addParams(url, params) {
  if (!isEmpty(params)) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return `${url}?${query}`;
  }
  return url;
}

router.get((req, res) => {
  if ('code' in req.query) {
    const tokenParams = {
      code: req.query.code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };

    axios
      .post(addParams(TOKEN_URL, tokenParams))
      .then((tokenRes) => {
        const data = parseParams(tokenRes.data);
        res.status(200).json({ success: true, token: data.access_token });
      })
      .catch((err) =>
        res.status(400).json({ success: false, message: err.toString() })
      );
  } else {
    res.status(400).json({ success: false, message: 'No code provided' });
  }
  return res;
});

module.exports = router;
