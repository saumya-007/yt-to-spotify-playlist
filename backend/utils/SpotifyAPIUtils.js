const axios = require('axios')
require('dotenv').config()
const { spotifyAPIs } = require('../utils/constants');


class SpotifyAPIUtils {
  constructor({
    spotifyOauthConfig,
    spotifyOauthOptionsConfig,
  }) {
    this.spotifyOauthOptionsConfig = spotifyOauthOptionsConfig;
    this.spotifyOauthConfig = spotifyOauthConfig;
  }

  // CALL TO GENERATE LINK FOR REDIRECTION TO CONSENT SCREEN
  generateOauthLink({ state }) {
    try {
      const options = {
        redirect_uri: this.spotifyOauthConfig.redirectUrl,
        client_id: this.spotifyOauthConfig.clientId,
        state,
        ...this.spotifyOauthOptionsConfig,
      }
      const qs = new URLSearchParams(options)

      return `${this.spotifyOauthConfig.rootUrl}?${qs.toString()}`
    } catch (e) {
      throw e;
    } finally {
      console.info('[SpotifyAPIUtils] :: Processing done ====> generateOauthLink')
    }
  }

  // CALL TO GET TOKEN DETAILS
  async getAccessToken({ code }) {
    try {
      const tokenDetails = await axios({
        method: 'post',
        url: this.spotifyOauthConfig.rootUrlForAccessToken,
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(this.spotifyOauthConfig.clientId + ':' + this.spotifyOauthConfig.clientSecret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          code,
          redirect_uri: this.spotifyOauthConfig.redirectUrl,
          grant_type: 'authorization_code'
        }).toString()
      })

      return tokenDetails.data;
    } catch (e) {
      throw e;
    } finally {
      console.info('[SpotifyAPIUtils] :: Processing done ====> getAccessToken')
    }
  }
  async updateAccessToken({ refreshToken }) {
    try {
      const tokenDetails = await axios({
        method: 'post',
        url: this.spotifyOauthConfig.rootUrlForAccessToken,
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(this.spotifyOauthConfig.clientId + ':' + this.spotifyOauthConfig.clientSecret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        }).toString()
      })

      return tokenDetails.data;
    } catch (e) {
      throw e;
    } finally {
      console.info('[SpotifyAPIUtils] :: Processing done ====> updateAccessToken')
    }
  }



  // CALL TO GET SPOTIFY USER DETAILS
  async getSpotifyUserDetails({ accessToken }) {
    try {
      const getSpotifyUserDetails = await axios({
        method: spotifyAPIs.userProfile.method,
        url: spotifyAPIs.userProfile.url,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })

      return getSpotifyUserDetails.data
    } catch (e) {
      throw e;
    } finally {
      console.info('[SpotifyAPIUtils] :: Processing done ====> getSpotifyUserDetails')
    }
  }

  // CALL TO CREATE SPOTIFY PLAYLIST  
  async createSpotifyPlaylist({ accessToken, userId, playlistName, playlistDescription }) {
    try {
      const newSpotifyPlayList = await axios({
        method: spotifyAPIs.createPlaylist.method,
        url: spotifyAPIs.createPlaylist.url.replace(':userId', userId),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        data: {
          "name": playlistName,
          "description": playlistDescription,
          "public": false
        }
      })

      return newSpotifyPlayList.data
    } catch (e) {
      throw e;
    } finally {
      console.info('[SpotifyAPIUtils] :: Processing done ====> createSpotifyPlaylist')
    }
  }

  // CALL TO SEARCH A TRACT ON SPOTIFY
  async searchSpotifyTrackByName({ accessToken, trackName }) {
    try {
      if (!trackName) {
        return ''
      }
      const options = {
        // fixed format to search using the remaster%20 or remaster<SPACE> URI option
        q: `remaster%20${spotifyAPIs.searchPlaylist.config.type_track}:${trackName}`,
        type: spotifyAPIs.searchPlaylist.config.type_track,
        limit: spotifyAPIs.searchPlaylist.config.limit,
        offset: spotifyAPIs.searchPlaylist.config.offset,
      }
      const qs = new URLSearchParams(options)
      const searchResult = await axios({
        method: spotifyAPIs.searchPlaylist.method,
        url: `${spotifyAPIs.searchPlaylist.url}?${qs}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })


      let unableToConvert = null;
      let uri = null;
      if (searchResult.data.tracks.items.length) {
        uri = searchResult.data.tracks.items[0].uri;
      } else {
        unableToConvert = trackName;
      }
      

      return {unableToConvert, uri};
    } catch (e) {
      throw e;
    } finally {
      console.info('[SpotifyAPIUtils] :: Processing done ====> searchSpotifyTrackByName')
    }
  }

  // CALL TO ADD ITEMS TO PLAYLIST (100 ITEMS CAN BE ADDED AT A TIME)
  async addItemToSpotifyPlaylist({ accessToken, playlistId, playlistURIs = [] }) {
    try {
      const response = await axios({
        method: spotifyAPIs.addItemToPlaylist.method,
        url: spotifyAPIs.addItemToPlaylist.url.replace(':playlistId', playlistId),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        data: {
          uris: playlistURIs,
        }
      })
      return response.data;
    } catch (e) {
      throw e;
    } finally {
      console.info('[SpotifyAPIUtils] :: Processing done ====> addItemToSpotifyPlaylist')
    }
  }

}

module.exports = SpotifyAPIUtils;