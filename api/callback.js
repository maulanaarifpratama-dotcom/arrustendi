// Langkah 2: tukar code GitHub dengan token, lalu serahkan ke jendela Decap lewat postMessage.
import { cookie, origin } from './_util.js';

const page = (status, payload, site) => `<!doctype html><meta charset="utf-8"><title>Masuk</title>
<script>
(function () {
  var site = ${JSON.stringify(site)};
  var msg = 'authorizing:github:${status}:' + ${JSON.stringify(JSON.stringify(payload))};
  function receive(e) {
    if (e.origin !== site) return;
    window.opener.postMessage(msg, e.origin);
    window.removeEventListener('message', receive);
    window.close();
  }
  window.addEventListener('message', receive);
  window.opener.postMessage('authorizing:github', site);
})();
</script>`;

export default async function handler(req, res) {
  const site = origin(req);
  const { code, state } = req.query;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Set-Cookie', 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0');

  if (!code || !state || state !== cookie(req, 'oauth_state')) {
    res.status(400).send(page('error', { message: 'State tidak cocok, ulangi login.' }, site));
    return;
  }
  const r = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
      client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${site}/api/callback`
    })
  });
  const data = await r.json();
  if (!data.access_token) {
    res.status(401).send(page('error', { message: data.error_description || 'Gagal menukar code.' }, site));
    return;
  }
  res.status(200).send(page('success', { token: data.access_token, provider: 'github' }, site));
}
