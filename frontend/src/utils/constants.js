export const ENDPOINTS = {
  'get-oauth-link-google': process.env.REACT_APP_BACKEND_ENDPOINT +'/oauth/oauthlink/google',
  'get-oauth-link-spotify': process.env.REACT_APP_BACKEND_ENDPOINT +'/oauth/oauthlink/spotify',
  'authenticate-google': process.env.REACT_APP_BACKEND_ENDPOINT +'/oauth/authenticate/google',
  'authenticate-spotify': process.env.REACT_APP_BACKEND_ENDPOINT +'/oauth/authenticate/spotify',
  'convert-youtube-playlist': process.env.REACT_APP_BACKEND_ENDPOINT +'/playlist/convert-youtube-playlist/:userId',
  'user-token-status': process.env.REACT_APP_BACKEND_ENDPOINT +'/user/user-token-status'
}

