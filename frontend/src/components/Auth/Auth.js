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

  return (
    <div className='container'>
      <div>
        <img src={backgroundImage} alt={'logo'} height={'500px'} />
      </div>
      <div>
        <a className={`submit-btn ${buttonClass.length ? buttonClass : ''}`} href={oauthLink}>Login</a>
      </div>
    </div>
  )
}

export default Auth