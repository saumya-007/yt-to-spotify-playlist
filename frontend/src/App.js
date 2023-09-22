import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
// import ThirdPartyLogin from './components/ThirdPartyLogin/ThirdPartyLogin';
import Auth from './components/Auth/Auth';
import ConverterComponenet from './components/ConverterComponent/ConverterComponenet';
import { Route, Routes, Outlet } from 'react-router-dom';
import Timeline from './components/TimeLine/TimeLine';
import API_REQUESTS from './utils/apiCalls';
import youtubeLogo from './images/vecteezy_watercolor-youtube-vector-logo-icon_8276806.jpg'
import spotifyLogo from './images/spotify logo.jpg'
import Loader from './components/Loader/Loader';

function App() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false);

  useEffect(() => {
    if (isGoogleAuthenticated) navigate('/spotify')
    if (isSpotifyAuthenticated) navigate('/converter')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoogleAuthenticated, isSpotifyAuthenticated])

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
                </Routes>
              </div>
            </div>
          </>
      }
    </>
  );
}

export default App;
