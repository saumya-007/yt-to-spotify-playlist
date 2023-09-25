const { responseSuccess, responseError } = require('../utils/constants');
const { Worker } = require('worker_threads')
const { join } = require('path');
const converterWorkerFile = join(__dirname, '..', 'web workers', 'converterWorker.js')

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
    const ytRegex = /^https:\/\/(www\.)?youtube\.com\/playlist\?list=[A-Za-z0-9_\-]+(&si=[A-Za-z0-9_\-]+)?$/gm;
    const serchParams = playlistUrl.split('?')[1];
    const playlistUrlSearchParams = new URLSearchParams(serchParams);
    if (!ytRegex.test(playlistUrl)) {
      throw new Error('Invalid yt link found!');
    } else {
      if (!playlistUrlSearchParams.get('list')) {
        throw new Error('Please provided valid playlist list id!');
      }
    }

    const workerData = { userTokenDetails, playlistId: playlistUrlSearchParams.get('list'), playlistName,  playlistDescription };
    // creating worker thread to avoid blocking of main thread while complex converstion process 
    const conversionResponse = await new Promise((resolve, reject) => {
      const converterWorker = new Worker(converterWorkerFile, { workerData });
      converterWorker.on('message', resolve);
      converterWorker.on('error', reject);
      converterWorker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      })
    });
    
    const { generatedUrl, failedToFindOnSpotify } = conversionResponse;
    res.status(200).send({
      ...responseSuccess, data: {
        url: generatedUrl,
        unableToCopy: failedToFindOnSpotify
      }
    })
  } catch (err) {
    console.error(err);
    res.status(404).send({ ...responseError, message: 'Error while converting playlist' })
  }
}