import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_REQUESTS from '../../utils/apiCalls'
import { toast } from 'react-toastify';
import './ConverterComponent.css'

function ConverterComponenet({setIsLoading}) {
  const navigate = useNavigate();
  const [sourceLink, setSourceLink] = useState('');
  const [playlistName, setPlaylistName] = useState('');

  // Debug effect to track component mounting/unmounting
  useEffect(() => {
    console.log('ConverterComponent mounted');
    return () => {
      console.log('ConverterComponent unmounted');
    };
  }, []);

  const convertHandler = () => {
    // Validate inputs
    if (!sourceLink.trim()) {
      toast.error('Please enter a YouTube playlist URL');
      return;
    }

    if (!playlistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    // Validate YouTube URL format (more flexible)
    const ytRegex = /^https:\/\/(www\.)?youtube\.com\/playlist\?.*list=([A-Za-z0-9_-]+)/;
    const isInvalid = !ytRegex.test(sourceLink.trim());

    if (isInvalid) {
      toast.error('Invalid YouTube playlist URL format');
      return;
    }

    console.log('Starting conversion with:', { sourceLink, playlistName });

    API_REQUESTS.convertYoutubeData({
      setResponse: (url) => {
        console.log('API Response received:', url, typeof url);
        console.log('Navigating to results with:', url);
        // Navigate to results page with the data - no need to check if mounted since we're leaving this page anyway
        navigate('/results', {
          state: {
            generatedLink: url,
            playlistName: playlistName.trim(),
            sourceLink: sourceLink.trim()
          }
        });
      },
      metaData: {
        playlistName: playlistName.trim(),
        playlistUrl: sourceLink.trim(),
        userId: localStorage.getItem('userId'),
      },
      setIsLoading
    });
  }





  return (
    <div className='converter-container'>
      <div className='converter-header'>
        <h1 className='converter-title'>Convert YouTube Playlist</h1>
        <p className='converter-subtitle'>
          Transform your YouTube playlists into Spotify playlists seamlessly.
          Just paste your YouTube playlist link and give it a name!
        </p>
      </div>

      <div className='converter-form'>
        <div className='form-group'>
          <label htmlFor='youtube-link' className='form-label'>
            YouTube Playlist Link
          </label>
          <input
            id='youtube-link'
            type='url'
            className='form-input'
            placeholder='https://youtube.com/playlist?list=...'
            value={sourceLink}
            onChange={(e) => setSourceLink(e.target.value)}
            aria-describedby='youtube-link-help'
          />
          <small id='youtube-link-help' className='form-help'>
            Paste the full YouTube playlist URL here
          </small>
        </div>

        <div className='form-group'>
          <label htmlFor='playlist-name' className='form-label'>
            Spotify Playlist Name
          </label>
          <input
            id='playlist-name'
            type='text'
            className='form-input'
            placeholder='My Awesome Playlist'
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            aria-describedby='playlist-name-help'
          />
          <small id='playlist-name-help' className='form-help'>
            Choose a name for your new Spotify playlist
          </small>
        </div>

        <div className='form-actions'>
          <button
            type='button'
            className='submit-btn converter-btn'
            onClick={convertHandler}
            disabled={!sourceLink.trim() || !playlistName.trim()}
          >
            🎵 Convert Playlist
          </button>


        </div>
      </div>


    </div>
  )
}

export default ConverterComponenet;
