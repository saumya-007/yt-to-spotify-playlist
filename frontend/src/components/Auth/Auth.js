import React, { useEffect, useState } from 'react'
import './Auth.css'
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';

function Auth({
  setAuthenticated,
  backgroundImage,
  apiCallGetLink,
  apiCallAuthenticate,
  buttonClass,
  setIsLoading,
}) {

  const [searchParams] = useSearchParams();
  const [oauthLink, setOauthLink] = useState('');
  const [code, setCode] = useState('');

  const handleOauthLink = (link) => {
    setOauthLink(link)
    setCode(searchParams.get('code'))
  }
  const handleCode = (message) => {
    if (message.message?.length) toast(message.message);
    setAuthenticated(true);
  }

  useEffect(() => {
    apiCallGetLink({ setResponse: handleOauthLink, setIsLoading })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonClass])

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    code && code.length && apiCallAuthenticate({ setResponse: handleCode, metaData: { code, userId }, setIsLoading });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const platformName = buttonClass === 'youtube' ? 'YouTube' : 'Spotify';
  const actionText = buttonClass === 'youtube' ? 'Connect your YouTube account to get started' : 'Connect your Spotify account to create playlists';

  return (
    <div className='container auth-container'>
      <div className='auth-logo-container'>
        <img src={backgroundImage} alt={`${platformName} logo`} className='auth-logo' />
      </div>
      <div className='auth-button-container'>
        <h2 className='auth-title'>Connect to {platformName}</h2>
        <p className='auth-subtitle'>{actionText}</p>
        <a
          className={`submit-btn ${buttonClass.length ? buttonClass : ''}`}
          href={oauthLink}
          aria-label={`Login to ${platformName}`}
        >
          Connect {platformName}
        </a>
      </div>
    </div>
  )
}

export default Auth