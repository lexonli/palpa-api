import proto from '@peterjskaltsis/proto';
import axios from 'axios';
import { CLIENT_ID, TOKEN_URL } from '../../config/github';

const CLIENT_SECRET = process.env.GITHUB_SECRET;

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
function parseUrlParams(url) {
  const idx = url.indexOf('?');
  if (idx === -1) return {};
  const query = url.substring(idx + 1);
  return parseParams(query);
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
  const oauthParams = parseUrlParams(req.url);
  if ('code' in oauthParams) {
    const tokenParams = {
      code: oauthParams.code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };
    axios
      .post(addParams(TOKEN_URL, tokenParams), {
        method: 'post',
      })
      .then((tokenRes) => {
        const data = parseParams(tokenRes.data);
        console.log(data);
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
