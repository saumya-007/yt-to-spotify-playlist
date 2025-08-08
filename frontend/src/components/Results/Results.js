import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LuClipboardCopy } from 'react-icons/lu';
import './Results.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [generatedLink, setGeneratedLink] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [sourceLink, setSourceLink] = useState('');

  useEffect(() => {
    // Get data from navigation state
    if (location.state) {
      setGeneratedLink(location.state.generatedLink || '');
      setPlaylistName(location.state.playlistName || '');
      setSourceLink(location.state.sourceLink || '');
    } else {
      // If no state, redirect back to converter
      navigate('/converter');
    }
  }, [location.state, navigate]);

  const copyHandler = () => {
    if (generatedLink.length === 0) {
      toast.warn('Link not generated');
      return;
    }
    
    // Add visual feedback to the button
    const copyButton = document.querySelector('.copy-btn');
    if (copyButton) {
      copyButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        copyButton.style.transform = '';
      }, 150);
    }
    
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        toast.success('Spotify playlist link copied to clipboard! 🎵');
      })
      .catch((err) => {
        toast.error('Failed to copy link')
        console.error('Failed to copy link: ', err);
      });
  };

  const startNewConversion = () => {
    navigate('/converter');
  };

  if (!generatedLink) {
    return (
      <div className='results-container'>
        <div className='loading-message'>
          <h2>Loading your results...</h2>
          <p>If this takes too long, please try converting again.</p>
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
        <div className='success-icon-large'>🎉</div>
        <h1 className='results-title'>Playlist Created Successfully!</h1>
        <p className='results-subtitle'>
          Your YouTube playlist "{playlistName}" has been converted to Spotify
        </p>
      </div>

      <div className='conversion-summary'>
        <div className='summary-item'>
          <h3>Original YouTube Playlist</h3>
          <div className='link-display'>
            <span className='link-text' title={sourceLink}>{sourceLink}</span>
          </div>
        </div>
        
        <div className='conversion-arrow'>→</div>
        
        <div className='summary-item'>
          <h3>New Spotify Playlist</h3>
          <div className='link-display spotify-link'>
            <span className='link-text' title={generatedLink}>{generatedLink}</span>
            <button
              onClick={copyHandler}
              className='copy-btn'
              aria-label='Copy playlist link'
              title='Copy to clipboard'
            >
              <LuClipboardCopy />
            </button>
          </div>
        </div>
      </div>

      <div className='results-actions'>
        <a 
          href={generatedLink} 
          className='submit-btn spotify-btn primary-action'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Open playlist in Spotify'
        >
          🎧 Open in Spotify
        </a>
        
        <button 
          onClick={startNewConversion}
          className='submit-btn secondary-action'
        >
          🎵 Convert Another Playlist
        </button>
      </div>

      <div className='success-message'>
        <span className='success-icon'>✨</span>
        <span>Your playlist is ready to enjoy! Share it with friends or start listening right away.</span>
      </div>
    </div>
  );
}

export default Results;
