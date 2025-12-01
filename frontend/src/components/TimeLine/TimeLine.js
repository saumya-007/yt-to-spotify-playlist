import './TimeLine.css';
import { useState, useEffect } from 'react'
import { TiTick } from "react-icons/ti";
import { BiRightArrowAlt } from 'react-icons/bi';
import { useNavigate, useLocation } from 'react-router-dom';

function Timeline({
  isGoogleAuthenticated,
  isSpotifyAuthenticated,
}) {

  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname, isGoogleAuthenticated, isSpotifyAuthenticated]);
  console.log({isGoogleAuthenticated, isSpotifyAuthenticated})

  const googleAuthClickedHandler = () => navigate('/');
  const spotifyAuthClickedHandler = () => navigate('/spotify');
  const ConverterClickedHandler = () => navigate('/converter');
  const ResultsClickedHandler = () => navigate('/results');

  // Determine current step based on route
  const isOnResults = currentPath === '/results';
  const isOnConverter = currentPath === '/converter';

  return (
    <>
      <div className='timeline'>
        {/* Step 1: YouTube Auth */}
        <div className='timeline-items'>
          <span className={`${isGoogleAuthenticated ? 'timeline-step-done' : 'timeline-step'}`} onClick={googleAuthClickedHandler}>
            {isGoogleAuthenticated ? <TiTick /> : 1}
          </span>
          <div className='timeline-label'>YouTube</div>
        </div>
        <div className='timeline-items'>
          <span className={`timeline-break ${isGoogleAuthenticated ? 'active' : ''}`}><BiRightArrowAlt size={40} /></span>
        </div>

        {/* Step 2: Spotify Auth */}
        <div className='timeline-items'>
          <span className={`${isSpotifyAuthenticated ? 'timeline-step-done' : (isGoogleAuthenticated ? 'timeline-step-active' : 'timeline-step')}`} onClick={spotifyAuthClickedHandler}>
            {isSpotifyAuthenticated ? <TiTick /> : 2}
          </span>
          <div className='timeline-label'>Spotify</div>
        </div>
        <div className='timeline-items'>
          <span className={`timeline-break ${isSpotifyAuthenticated ? 'active' : ''}`}><BiRightArrowAlt size={40} /></span>
        </div>

        {/* Step 3: Convert */}
        <div className='timeline-items'>
          <span className={`${isOnResults ? 'timeline-step-done' : (isOnConverter ? 'timeline-step-active' : 'timeline-step')}`} onClick={ConverterClickedHandler}>
            {isOnResults ? <TiTick /> : 3}
          </span>
          <div className='timeline-label'>Convert</div>
        </div>
        <div className='timeline-items'>
          <span className={`timeline-break ${isOnResults ? 'active' : ''}`}><BiRightArrowAlt size={40} /></span>
        </div>

        {/* Step 4: Results */}
        <div className='timeline-items'>
          <span className={`${isOnResults ? 'timeline-step-done' : 'timeline-step'}`} onClick={ResultsClickedHandler}>
            {isOnResults ? <TiTick /> : 4}
          </span>
          <div className='timeline-label'>Results</div>
        </div>
      </div>
    </>
  )
}

export default Timeline