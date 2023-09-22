const express = require('express');
const playlistRoutes = express.Router();
const refreshTokenIfExpired = require('../middleware/refreshTokenIfExpired');

const {
  convertYoutubePlaylist
} = require('../controller/playlistController');

playlistRoutes
  .route('/convert-youtube-playlist/:userId')
  .post(refreshTokenIfExpired, convertYoutubePlaylist);

module.exports = playlistRoutes;