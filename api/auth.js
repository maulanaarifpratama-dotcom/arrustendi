// Langkah 1 login Decap CMS: kirim pengguna ke GitHub. Client ID hanya dibaca dari env Vercel.
import { newState, origin } from './_util.js';

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('OAUTH_GITHUB_CLIENT_ID belum diisi di Vercel.');
    return;
  }
  const state = newState();
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${origin(req)}/api/callback`);
  url.searchParams.set('scope', 'repo,user');
  url.searchParams.set('state', state);
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  res.redirect(302, url.toString());
}
