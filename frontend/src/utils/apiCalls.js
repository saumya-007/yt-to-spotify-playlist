import { ENDPOINTS } from './constants'
import axios from 'axios'
import { toast } from 'react-toastify';


const getOauthLinkGoogle = async ({ setResponse }) => {
  try {
    axios({
      method: 'get',
      url: ENDPOINTS['get-oauth-link-google'],
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      setResponse(response.data.data);
    }).catch((error) => {
      console.log(error);
    });
  } catch (e) {
    toast.error('Error while getting oauth link')
    console.log(e)
  }
}

const getOauthLinkSpotify = async ({ setResponse }) => {
  try {
    axios({
      method: 'get',
      url: ENDPOINTS['get-oauth-link-spotify'],
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      setResponse(response.data.data);
    }).catch((error) => {
      console.log(error);
    });
  } catch (e) {
    toast.error('Error while getting oauth link')
    console.log(e)
  }
}

const authenticateSportify = async ({ setResponse, metaData, setIsLoading }) => {
  try {
    setIsLoading(true);
    const qs = new URLSearchParams({userId: metaData.userId})
    axios({
      method: 'post',
      url: ENDPOINTS['authenticate-spotify'] + `?${qs.toString()}`,
      headers: {
        'Content-Type': 'application/json',
        'Auth-Code': metaData.code
      }
    }).then((response) => {
      setIsLoading(false);
      setResponse(response.data.data);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    });
  } catch (e) {
    toast.error('Error while generating authenticating sportify')
    console.log(e)
  }
}

const authenticateGoogle = async ({ setResponse, metaData, setIsLoading }) => {
  setIsLoading(true);
  try {
    axios({
      method: 'post',
      url: ENDPOINTS['authenticate-google'],
      headers: {
        'Content-Type': 'application/json',
        'Auth-Code': metaData.code
      }
    }).then((response) => {
      setIsLoading(false);
      localStorage.setItem('userId', response.data.data.metaData.id)
      setResponse(response.data.data);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    });
  } catch (e) {
    toast.error('Error while generating authenticating google')
    console.log(e)
  }
}

const convertYoutubeData = async ({ setResponse, metaData, setIsLoading }) => {
  setIsLoading(true);
  try {
    axios({
      method: 'post',
      url: ENDPOINTS['convert-youtube-playlist'].replace(':userId', metaData.userId),
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        "playlist_name":  metaData.playlistName,
        "playlist_url":  metaData.playlistUrl,
    }
    }).then((response) => {
      setIsLoading(false);
      setResponse(response.data.data.url);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    });
  } catch (e) {
    toast.error('Error while generating oauth link')
    console.log(e)
  }
}


const API_REQUESTS = {
  getOauthLinkGoogle,
  getOauthLinkSpotify,
  convertYoutubeData,
  authenticateSportify,
  authenticateGoogle,
}

export default API_REQUESTS;