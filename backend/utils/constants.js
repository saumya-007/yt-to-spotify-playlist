const constants = {
  responseSuccess: {
    status: 'success',
    data: null,
  },
  responseError: {
    status: 'error',
    message: 'something went wrong'
  },
  spotifyAPIs: {
    userProfile: {
      method: 'get',
      url: 'https://api.spotify.com/v1/me'
    },
    createPlaylist: {
      method: 'post',
      url: 'https://api.spotify.com/v1/users/:userId/playlists'
    },
    searchPlaylist: {
      method: 'get',
      url: 'https://api.spotify.com/v1/search',
      config: {
        type_track: 'track',
        type_artist: 'artist',
        limit: 1,
        offset: 0,
      }
    },
    addItemToPlaylist: {
      method: 'post',
      url: 'https://api.spotify.com/v1/playlists/:playlistId/tracks',
    }
  },
  googleAPIs: {
    playlistDetails: {
      method: 'get',
      url: 'https://youtube.googleapis.com/youtube/v3/playlistItems',
      config: {
        part: 'snippet',
        maxResults: 50, // a max of 50 can be called at a time
      }
    }
  }
}

module.exports = constants;