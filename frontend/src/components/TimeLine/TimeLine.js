import React, { useState, useEffect } from 'react'
import './TimeLine.css';
import { TiTick } from "react-icons/ti";
import { BiRightArrowAlt } from 'react-icons/bi';
import { useNavigate, useLocation } from 'react-router-dom';

function Timeline({
  isGoogleAuthenticated,
  isSpotifyAuthenticated,
  setIsGoogleAuthenticated,
  setIsSpotifyAuthenticated,
}) {

  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
    console.log('Timeline - Current path:', location.pathname);
    console.log('Timeline - Google Auth:', isGoogleAuthenticated);
    console.log('Timeline - Spotify Auth:', isSpotifyAuthenticated);
  }, [location.pathname, isGoogleAuthenticated, isSpotifyAuthenticated]);

  const googleAuthClickedHandler = () => navigate('/');
  const spotifyAuthClickedHandler = () => navigate('/spotify');
  const ConverterClickedHandler = () => navigate('/converter');
  const ResultsClickedHandler = () => navigate('/results');

  // Determine current step based on route
  const isOnResults = currentPath === '/results';
  const isOnConverter = currentPath === '/converter';
  const isConverterCompleted = isOnResults;

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
          <span className={`${isConverterCompleted ? 'timeline-step-done' : (isOnConverter ? 'timeline-step-active' : 'timeline-step')}`} onClick={ConverterClickedHandler}>
            {isConverterCompleted ? <TiTick /> : 3}
          </span>
          <div className='timeline-label'>Convert</div>
        </div>
        <div className='timeline-items'>
          <span className={`timeline-break ${isConverterCompleted ? 'active' : ''}`}><BiRightArrowAlt size={40} /></span>
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