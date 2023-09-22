const express = require('express');
const oauthRoutes = express.Router();

const {
  getGoogleOauthLink,
  getSpotifyOauthLink,
  spotifyAuthenticate,
  googleAuthenticate,
} = require('../controller/oauthController');

oauthRoutes
  .route('/oauthlink/google')
  .get(getGoogleOauthLink);

oauthRoutes
  .route('/oauthlink/spotify')
  .get(getSpotifyOauthLink);

oauthRoutes
  .route('/authenticate/spotify')
  .post(spotifyAuthenticate);

oauthRoutes
  .route('/authenticate/google')
  .post(googleAuthenticate);

module.exports = oauthRoutes;