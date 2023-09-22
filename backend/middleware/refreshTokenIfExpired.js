const { responseError } = require('../utils/constants')
const { googleOauthOptionsConfig,  spotifyOauthOptionsConfig } = require('../config/config')
const { getTime } = require('../utils/helperFunctions')
const googleOauthConfig = require('../oauth-creeds-google')
const spotifyOauthConfig = require('../oauth-creeds-spotify')

const {
  updateTokenDetailsByUserId,
  getTokenDetailsByUserId,
} = require('../db/queries');

const GoogleAPIUtils = require('../utils/GoogleAPIUtils');
const googleAPICall = new GoogleAPIUtils({
  googleOauthConfig,
  googleOauthOptionsConfig,
});

const SpotifyAPIUtils = require('../utils/SpotifyAPIUtils');
const spotifyAPICall = new SpotifyAPIUtils({
  spotifyOauthConfig,
  spotifyOauthOptionsConfig,
});

const refreshTokenIfExpired = async function (req, res, next) {
  const userId = req.params.userId;
  const tokenDetails = await getTokenDetailsByUserId({ userId });
  if (!tokenDetails) {
    res.status(404).send({ ...responseError, message: 'Please login to google first' })
  }

  const googleExpiryDate = getTime(tokenDetails.google_token_expires_at);
  const spotifyExpiryDate = getTime(tokenDetails.spotify_token_expires_at);

  // checking if tine difference between expiry and now is more than 10min to be sage as the conversion process can take a long time based on playlist items    
  const maxExpiryAllowed = getTime() - 300000;

  if (googleExpiryDate < maxExpiryAllowed) {
    const updatedTokenDetails = await googleAPICall.updateAccessToken({ refreshToken: tokenDetails.refresh_token_google });
    console.log(updatedTokenDetails)
    const expiryTime = new Date(Date.now() + (updatedTokenDetails.expires_in * 1000));
    await updateTokenDetailsByUserId({
      userId,
      accessTokenGoogle: updatedTokenDetails.access_token,
      updatedBy: userId,
      googleTokenExpiresAt: expiryTime
    });
  }
  if (spotifyExpiryDate < maxExpiryAllowed) {
    const updatedTokenDetails = await spotifyAPICall.updateAccessToken({ refreshToken: tokenDetails.refresh_token_spotify });
    console.log(updatedTokenDetails)
    const expiryTime = new Date(Date.now() + (updatedTokenDetails.expires_in * 1000));
    await updateTokenDetailsByUserId({
      userId,
      accessTokenSpotify: updatedTokenDetails.access_token,
      updatedBy: userId,
      spotifyTokenExpiresAt: expiryTime
    });
  }

  next();
}

module.exports = refreshTokenIfExpired;