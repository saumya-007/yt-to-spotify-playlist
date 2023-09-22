import React from 'react'
import './TimeLine.css';
import { TiTick } from "react-icons/ti";
import { BiRightArrowAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

function Timeline({
  isGoogleAuthenticated,
  isSpotifyAuthenticated,
  setIsGoogleAuthenticated,
  setIsSpotifyAuthenticated,
}) {

  const navigate = useNavigate();
  const googleAuthClickedHandler = () => navigate('/');
  const spotifyAuthClickedHandler = () => navigate('/spotify');
  const ConverterClickedHandler = () => navigate('/converter');

  return (
    <>
      <div className='timeline'>
        <div className='timeline-items'>
          <span className={`${isGoogleAuthenticated ? 'timeline-step-done' : 'timeline-step'}`} onClick={googleAuthClickedHandler}>{isGoogleAuthenticated ? <TiTick /> : 1}</span>
        </div>
        <div className='timeline-items'>
          <span className='timeline-break'><BiRightArrowAlt size={40} /></span>
        </div>
        <div className='timeline-items'>
          <span className='timeline-step' onClick={spotifyAuthClickedHandler}>2</span>
        </div>
        <div className='timeline-items'>
          <span className='timeline-break'><BiRightArrowAlt size={40} /></span>
        </div>
        <div className='timeline-items'>
          <span className='timeline-step' onClick={ConverterClickedHandler}>3</span>
        </div>
      </div>
    </>
  )
}

export default Timeline