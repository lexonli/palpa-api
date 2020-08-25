import proto from '@peterjskaltsis/proto';
import axios from 'axios';
import querystring from 'querystring';
import { CLIENT_ID, CLIENT_SECRET, TOKEN_URL } from '../../config/github';

/**
 * Makes a post request to github api with a code to obtain an access token
 * @param {{code: string, client_id: string, client_secret: string}} tokenParams
 * - code and client credentials from github
 * @param {object} res - response
 */
function fetchGithubAccessToken(tokenParams, res) {
  axios
    .post(TOKEN_URL, null, { params: tokenParams })
    .then((tokenRes) => {
      const data = querystring.decode(tokenRes.data);
      if (data.error) {
        return res.status(400).json({ success: false, message: data.error });
      }
      return res.status(200).json({ success: true, token: data.access_token });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err.toString() });
    });
}

const router = proto();

router.get((req, res) => {
  if (!req.query.code) {
    return res
      .status(400)
      .json({ success: false, message: 'No code provided' });
  }
  const tokenParams = {
    code: req.query.code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  fetchGithubAccessToken(tokenParams, res);
  return res;
});

export default router;
