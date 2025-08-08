const { workerData, parentPort } = require('worker_threads');
const { wait, splitArray } = require('../utils/helperFunctions');

const {
  googleOauthOptionsConfig,
  spotifyOauthOptionsConfig,
} = require('../config/config')
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

let nextPageToken = null;
let spotifyTracksUriList = [];
let failedToFindOnSpotify = [];

(async () => {
  try {
    const { userTokenDetails, playlistId, playlistName, playlistDescription } = workerData;
    do {
      // Getting youtube playlist playlist details (Can get a max of 50 items)
      const googlePlaylistDetails = await googleAPICall.getPlaylistDetails({
        accessToken: userTokenDetails.access_token_google,
        metaData: {
          playlistId,
        },
        nextPageToken,
      });

      nextPageToken = googlePlaylistDetails.nextPageToken;

      const spotifyTrackItemsStatus = await Promise.all(googlePlaylistDetails.trackDetails.map(async (detail) => {
        return await spotifyAPICall.searchSpotifyTrackByName({
          accessToken: userTokenDetails.access_token_spotify,
          trackName: detail.name,
          artistName: detail.artist
        });
      }));

      spotifyTracksUriList.push(...spotifyTrackItemsStatus.filter((item) => item.uri).map((item) => item.uri));
      failedToFindOnSpotify.push(...spotifyTrackItemsStatus.filter((item) => item.unableToConvert).map((item) => item.unableToConvert));

      if (nextPageToken) await wait(5) // Addded to deal with spotify rate limiting

    } while (nextPageToken);

    // Once all data is recieved from sportify we we create a new playlist
    const newSpotifyPlayList = await spotifyAPICall.createSpotifyPlaylist({
      accessToken: userTokenDetails.access_token_spotify,
      userId: userTokenDetails.spotify_user_id,
      playlistName,
      playlistDescription,
    })

    const splittedSpotifyTracksUriList = splitArray({ parts: 100, arr: spotifyTracksUriList });

    // Add data to that playlist (Can add A maximum of 100 items)
    splittedSpotifyTracksUriList.map(async (uriList) => {
      return await spotifyAPICall.addItemToSpotifyPlaylist({
        accessToken: userTokenDetails.access_token_spotify,
        playlistId: newSpotifyPlayList.id,
        playlistURIs: uriList,
      })
    })
    parentPort.postMessage({ generatedUrl: newSpotifyPlayList.external_urls.spotify, failedToFindOnSpotify });
  } catch (error) {
    // Send an error message to the parent thread
    console.error(error);
    parentPort.postMessage({ error: error.message ? error.message : 'conversion process error' });
  }
})()