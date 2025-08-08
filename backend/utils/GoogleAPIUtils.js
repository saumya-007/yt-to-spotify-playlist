const axios = require('axios')
require('dotenv').config()
const { googleAPIs } = require('../utils/constants');

class GoogleAPIUtils {
  constructor({
    googleOauthConfig,
    googleOauthOptionsConfig,
  }) {
    this.googleOauthOptionsConfig = googleOauthOptionsConfig;
    this.googleOauthConfig = googleOauthConfig;
  }

  // CALL TO GENERATE LINK FOR REDIRECTION TO CONSENT SCREEN
  generateOauthLink() {
    try {
      const options = {
        redirect_uri: this.googleOauthConfig.redirectUrl,
        client_id: this.googleOauthConfig.clientId,
        ...this.googleOauthOptionsConfig,
      }
      const qs = new URLSearchParams(options)

      return `${this.googleOauthConfig.rootUrl}?${qs.toString()}`
    } catch (e) {
      throw e;
    } finally {
      console.info('[GoogleAPIUtils] :: Processing done ====> generateOauthLink')
    }
  }

  // CALL TO GET TOKEN DETAILS
  async getAccessToken({ code }) {
    try {
      const tokenDetails = await axios({
        method: 'post',
        url: this.googleOauthConfig.rootUrlForAccessToken,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          client_id: this.googleOauthConfig.clientId,
          client_secret: this.googleOauthConfig.clientSecret,
          code,
          redirect_uri: this.googleOauthConfig.redirectUrl,
          grant_type: 'authorization_code'
        }).toString()
      })

      return tokenDetails.data;
    } catch (e) {
      throw e;
    } finally {
      console.info('[GoogleAPIUtils] :: Processing done ====> getAccessToken')
    }
  }

  async updateAccessToken({ refreshToken }) {
    try {
      const tokenDetails = await axios({
        method: 'post',
        url: this.googleOauthConfig.rootUrlForAccessToken,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          client_id: this.googleOauthConfig.clientId,
          client_secret: this.googleOauthConfig.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        }).toString()
      })

      return tokenDetails.data;
    } catch (e) {
      throw e;
    } finally {
      console.info('[GoogleAPIUtils] :: Processing done ====> updateAccessToken')
    }
  }

  // CALL TO GET PLAYLIST DETAILS
  async getPlaylistDetails({ accessToken, metaData, nextPageToken = null }) {
    try {
      const params = {
        ...googleAPIs.playlistDetails.config,
        playlistId: metaData.playlistId,
        key: process.env.GOOGLE_API_KEY
      }

      if (nextPageToken) params['pageToken'] = nextPageToken;
      const googleQueryParams = new URLSearchParams(params)
      const playlistDetails = await axios({
        method: googleAPIs.playlistDetails.method,
        url: `${googleAPIs.playlistDetails.url}?${googleQueryParams.toString()}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      const returnObject = {
        nextPageToken: playlistDetails.data.nextPageToken || null, 
        trackDetails: [],
      };

      playlistDetails.data.items.map((item) => {
        returnObject['trackDetails'].push({
          name: item.snippet.title,
          artist: item.snippet.videoOwnerChannelTitle,
        });
      });

      return returnObject;
    } catch (e) {
      throw e;
    } finally {
      console.info('[GoogleAPIUtils] :: Processing done ====> getPlaylistDetails')
    }
  }
}

module.exports = GoogleAPIUtils;