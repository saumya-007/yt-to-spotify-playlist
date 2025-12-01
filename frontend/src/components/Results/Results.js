import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoCloudDoneOutline } from "react-icons/io5";
import { TfiFaceSad } from "react-icons/tfi";
import './Results.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [generatedLink, setGeneratedLink] = useState('');
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    // Get data from navigation state
    if (location.state) {
      setGeneratedLink(location.state.generatedLink || '');
      setPlaylistName(location.state.playlistName || '');
    } else {
      // If no state, redirect back to converter
      navigate('/converter');
    }
  }, [location.state, navigate]);

  const startNewConversion = () => {
    navigate('/converter');
  };

  if (!generatedLink) {
    return (
      <div className='results-container'>
        <div className='loading-message'>
          <div className='failure-icon-large'>
            <TfiFaceSad />
          </div>
          <h2>Something went wrong !</h2>
          <p>I F*ed up, please try converting again.</p>
          <button onClick={startNewConversion} className='submit-btn'>
            Back to Converter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='results-container'>
      <div className='results-header'>
        <div className='success-icon-large'>
          <IoCloudDoneOutline />
        </div>
        <h1 className='results-title'>Playlist Created Successfully!</h1>
        <p className='results-subtitle'>
          Your YouTube playlist "{playlistName}" has been converted to Spotify
        </p>
      </div>


      <div className='results-actions'>
        <a 
          href={generatedLink} 
          className='submit-btn spotify-btn primary-action'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Open playlist in Spotify'
        >
          Open in Spotify
        </a>
        
        <button 
          onClick={startNewConversion}
          className='submit-btn secondary-action'
        >
          Convert Another Playlist
        </button>
      </div>

      <div className='success-message'>
        <span>Your playlist is ready to enjoy! Share it with friends or start listening right away.</span>
      </div>
    </div>
  );
}

export default Results;
