import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import ThirdPartyLogin from './components/ThirdPartyLogin/ThirdPartyLogin';
import Auth from './components/Auth/Auth';
import ConverterComponenet from './components/ConverterComponent/ConverterComponenet';
import Results from './components/Results/Results';
import Timeline from './components/TimeLine/TimeLine';
import Loader from './components/Loader/Loader';

import API_REQUESTS from './utils/apiCalls';

import youtubeLogo from './images/vecteezy_watercolor-youtube-vector-logo-icon_8276806.jpg'
import spotifyLogo from './images/spotify logo.jpg'

function App() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);

  useEffect(() => {

    API_REQUESTS.getUserTokenStatus({
      setResponse: (response) => {
        setIsGoogleAuthenticated(response.googleAuthenticated);
        setIsSpotifyAuthenticated(response.spotifyAuthenticated);
      },
      userId: localStorage.getItem('userId'),
    });

    // Only navigate if we're not already on the target route or results
    const currentPath = window.location.pathname;

    if (isGoogleAuthenticated && currentPath !== '/spotify' && currentPath !== '/converter' && currentPath !== '/results') {
      navigate('/spotify');
    }
    if (isSpotifyAuthenticated && currentPath !== '/converter' && currentPath !== '/results') {
      navigate('/converter');
    }
  }, [isGoogleAuthenticated, isSpotifyAuthenticated, navigate])

  return (
    <>
      {
        isLoading ? <Loader /> :
          <>
            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <div className='main-container'>
              <div className='time-line-navigator'>
                <Timeline
                  isGoogleAuthenticated={isGoogleAuthenticated}
                  isSpotifyAuthenticated={isSpotifyAuthenticated}
                />
              </div>
              <div className='container'>
                <Outlet />
                <Routes>
                  <Route path="/" element={
                    <Auth
                      setAuthenticated={setIsGoogleAuthenticated}
                      backgroundImage={youtubeLogo}
                      apiCallGetLink={API_REQUESTS.getOauthLinkGoogle}
                      apiCallAuthenticate={API_REQUESTS.authenticateGoogle}
                      buttonClass={'youtube'}
                      setIsLoading={setIsLoading}
                    />
                  } />
                  <Route path="/spotify" element={
                    <Auth
                      setAuthenticated={setIsSpotifyAuthenticated}
                      backgroundImage={spotifyLogo}
                      apiCallGetLink={API_REQUESTS.getOauthLinkSpotify}
                      apiCallAuthenticate={API_REQUESTS.authenticateSportify}
                      buttonClass={'spotify'}
                      setIsLoading={setIsLoading}
                    />
                  } />
                  <Route path="/converter" element={
                    <ConverterComponenet setIsLoading={setIsLoading}/>
                  } />
                  <Route path="/results" element={
                    <Results />
                  } />
                </Routes>
              </div>
            </div>
          </>
      }
    </>
  );
}

export default App;
