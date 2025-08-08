const jwt = require('jsonwebtoken');
const { responseSuccess, responseError } = require('../utils/constants');
const {
  googleOauthOptionsConfig,
  spotifyOauthOptionsConfig,
} = require('../config/config');
const { generateRandomString } = require('../utils/helperFunctions');
const googleOauthConfig = require('../oauth-creeds-google');
const spotifyOauthConfig = require('../oauth-creeds-spotify');

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

const {
  addUser,
  getUserById,
  getUserByEmail,
  updateTokenDetails,
  updateTokenDetailsByUserId,
  getTokenDetailsByUserId,
  addTokenDetails,
} = require('../db/queries');

module.exports.getGoogleOauthLink = function (_, res) {
  try {
    const oauthLink = googleAPICall.generateOauthLink();
    res.status(200).send({ ...responseSuccess, data: oauthLink });
  } catch (err) {
    res.status(400).send({ ...responseError, message: 'Error while generating oauth link for google' });
  }
}

module.exports.googleAuthenticate = async function (req, res) {
  try {
    if (!req.headers['auth-code']) {
      res.status(200).send({ ...responseError, message: 'Auth code not found' });
    }
    const tokenDetails = await googleAPICall.getAccessToken({ code: req.headers['auth-code'] });
    const { email } = jwt.decode(tokenDetails.id_token);
    
    // expires_in is in seconds hence convert it in milliseconds and saving it
    const expiryTime = new Date(Date.now() + (tokenDetails.expires_in * 1000));

    const userDetails = await getUserByEmail({ email, fieldsToQuery: ['id'] });

    let userId = null;
    if (!userDetails) {
      const newUserDetails = await addUser({ email });
      userId = newUserDetails.id;
    } else {
      userId = userDetails.id;
    }
    const userTokenDetails = await getTokenDetailsByUserId({ userId });

    if (!(userTokenDetails.access_token_google && userTokenDetails.refresh_token_google)) {
      await addTokenDetails({
        userId,
        accessTokenGoogle: tokenDetails.access_token,
        refreshTokenGoogle: tokenDetails.refresh_token,
        createdBy: userId,
        googleTokenExpiresAt: expiryTime
      });
    } else {
      await updateTokenDetails({
        id: userTokenDetails.id,
        userId,
        accessTokenGoogle: tokenDetails.access_token,
        refreshTokenGoogle: tokenDetails.refresh_token,
        updatedBy: userId,
        googleTokenExpiresAt: expiryTime
      });
    }

    res.status(200).send({
      ...responseSuccess, data: {
        message: 'google authenticated',
        metaData: {
          id: userId
        }
      }
    });
  } catch (err) {
    res.status(400).send({ ...responseError, message: 'Error while google authentication' });
  }
}

module.exports.getSpotifyOauthLink = function (_, res) {
  try {
    const state = generateRandomString(16);
    const oauthLink = spotifyAPICall.generateOauthLink({ state });
    res.status(200).send({ ...responseSuccess, data: oauthLink });
  } catch (err) {
    console.log(err);
    res.status(400).send({ ...responseError, message: 'Error while generating oauth link for spotify' });
  }
}

module.exports.spotifyAuthenticate = async function (req, res) {
  try {
    if (!req.headers['auth-code']) {
      throw new Error('Auth code not found');
    }
    const userId = req.query.userId;
    const userDetails = await getUserById({ id: req.query.userId });
    if (!userDetails) {
      throw new Error('Please login to google first');
    }

    const tokenDetails = await spotifyAPICall.getAccessToken({ code: req.headers['auth-code'] });
    // expires_in is in seconds hence convert it in milliseconds and saving it
    const expiryTime = new Date(Date.now() + (tokenDetails.expires_in * 1000));
    const sopritfyUserDetails = await spotifyAPICall.getSpotifyUserDetails({ accessToken: tokenDetails.access_token });

    await updateTokenDetailsByUserId({
      userId,
      accessTokenSpotify: tokenDetails.access_token,
      refreshTokenSpotify: tokenDetails.refresh_token,
      updatedBy: userId,
      sporitfyUserId: sopritfyUserDetails.id,
      spotifyTokenExpiresAt: expiryTime
    });

    res.status(200).send({ ...responseSuccess, data: 'sportify authenticated' });
  } catch (err) {
    res.status(400).send({ ...responseError, message: 'Error while sportify authentication' });
  }
}
