import proto from '@peterjskaltsis/proto';
import axios from 'axios';
import querystring from 'querystring';
import { CLIENT_ID, CLIENT_SECRET, TOKEN_URL } from '../../config/github';

const router = proto();

router.get((req, res) => {
  if (!req.query.code) {
    return res.status(400).json({ success: false, message: 'No code provided' });
  }
  const tokenParams = {
    code: req.query.code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  axios
    .post(TOKEN_URL, null,  { params: tokenParams })
    .then((tokenRes) => {
      const data = querystring.decode(tokenRes.data)
      return res.status(200).json({ success: true, token: data.access_token });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err.toString() })
    });
});

export default router;
