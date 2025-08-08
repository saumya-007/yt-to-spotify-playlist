import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
// import ThirdPartyLogin from './components/ThirdPartyLogin/ThirdPartyLogin';
import Auth from './components/Auth/Auth';
import ConverterComponenet from './components/ConverterComponent/ConverterComponenet';
import Results from './components/Results/Results';
import { Route, Routes, Outlet } from 'react-router-dom';
import Timeline from './components/TimeLine/TimeLine';
import API_REQUESTS from './utils/apiCalls';
import youtubeLogo from './images/vecteezy_watercolor-youtube-vector-logo-icon_8276806.jpg'
import spotifyLogo from './images/spotify logo.jpg'
import Loader from './components/Loader/Loader';

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(() => {
    // Check if user is already authenticated (has userId in localStorage)
    return localStorage.getItem('userId') !== null;
  });
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(() => {
    // Check if user completed Spotify auth (you can add more specific check here)
    return localStorage.getItem('spotifyAuthenticated') === 'true';
  });

  useEffect(() => {
    // Only navigate if we're not already on the target route or results
    const currentPath = window.location.pathname;
    console.log('App useEffect - Current path:', currentPath);
    console.log('App useEffect - Google Auth:', isGoogleAuthenticated);
    console.log('App useEffect - Spotify Auth:', isSpotifyAuthenticated);

    if (isGoogleAuthenticated && currentPath !== '/spotify' && currentPath !== '/converter' && currentPath !== '/results') {
      console.log('App - Navigating to /spotify');
      navigate('/spotify');
    }
    if (isSpotifyAuthenticated && currentPath !== '/converter' && currentPath !== '/results') {
      console.log('App - Navigating to /converter');
      navigate('/converter');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoogleAuthenticated, isSpotifyAuthenticated])

  // Debug route changes
  useEffect(() => {
    console.log('App - Route changed to:', location.pathname);
  }, [location.pathname])

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
                  setIsGoogleAuthenticated={setIsGoogleAuthenticated}
                  setIsSpotifyAuthenticated={setIsSpotifyAuthenticated}
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
