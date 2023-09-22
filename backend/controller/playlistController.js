const { responseSuccess, responseError } = require('../utils/constants');
const {
  googleOauthOptionsConfig,
  spotifyOauthOptionsConfig,
} = require('../config/config')
const { wait, splitArray } = require('../utils/helperFunctions');
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
  getTokenDetailsByUserId,
} = require('../db/queries');


module.exports.convertYoutubePlaylist = async function (req, res) {
  try {
    const userId = req.params.userId;
    const playlistUrl = req.body.playlist_url;
    const playlistName = req.body.playlist_name;
    const playlistDescription = req.body.playlist_description ? req.body.playlist_description : '';

    if (!playlistName) {
      throw new Error('Please provide playlist name!');
    }

    // Getting tokens associated to users
    const userTokenDetails = await getTokenDetailsByUserId({ userId });
    if (!userTokenDetails) {
      throw new Error('User token not found. Please login to google first!');
    }

    // Validating Youtube Playlist URL
    const ytRegex = /^https:\/\/www\.youtube\.com\/playlist\?list=[A-Za-z0-9_\-]+(&si=[A-Za-z0-9_\-]+)?$/gm;
    const serchParams = playlistUrl.split('?')[1];
    const playlistUrlSearchParams = new URLSearchParams(serchParams);
    if (!ytRegex.test(playlistUrl)) {
      throw new Error('Invalid yt link found!');
    } else {
      if (!playlistUrlSearchParams.get('list')) {
        throw new Error('Please provided valid playlist list id!');
      }
    }

    let nextPageToken = null;
    let spotifyTracksUriList = [];
    let failedToFindOnSpotify = [];

    do {
      // Getting youtube playlist playlist details (Can get a max of 50 items)
      const googlePlaylistDetails = await googleAPICall.getPlaylistDetails({
        accessToken: userTokenDetails.access_token_google,
        metaData: {
          playlistUrlSearchParams,
        },
        wantedItems: ['trackNames'],
        nextPageToken,
      });

      nextPageToken = googlePlaylistDetails.nextPageToken;

      const spotifyTrackItemsStatus = await Promise.all(googlePlaylistDetails.trackNames.map(async (name) => {
        return await spotifyAPICall.searchSpotifyTrackByName({
          accessToken: userTokenDetails.access_token_spotify,
          trackName: name
        });
      }));

      spotifyTracksUriList.push(...spotifyTrackItemsStatus.filter((item) => item.uri).map((item) => item.uri));
      failedToFindOnSpotify.push(...spotifyTrackItemsStatus.filter((item) => item.unableToConvert).map((item) => item.unableToConvert));
      
      if(nextPageToken) await wait(5) // Addded to deal with spotify rate limiting

    } while (nextPageToken);

    // Once all data is recieved from sportify we we create a new playlist
    const newSpotifyPlayList = await spotifyAPICall.createSpotifyPlaylist({
      accessToken: userTokenDetails.access_token_spotify,
      userId: userTokenDetails.spotify_user_id,
      playlistName,
      playlistDescription,
    })

    const splittedSpotifyTracksUriList = splitArray({parts: 100, arr: spotifyTracksUriList});

    // Add data to that playlist (Can add A maximum of 100 items)
    splittedSpotifyTracksUriList.map(async (uriList) => {
      return await spotifyAPICall.addItemToSpotifyPlaylist({
        accessToken: userTokenDetails.access_token_spotify,
        playlistId: newSpotifyPlayList.id,
        playlistURIs: uriList,
      })
    })

    res.status(200).send({ ...responseSuccess, data: {
      url: newSpotifyPlayList.external_urls.spotify,
      unableToCopy: newSpotifyPlayList
    }})
  } catch (err) {
    console.log(err);
    res.status(404).send({ ...responseError, message: 'Error while converting playlist' })
  }
}