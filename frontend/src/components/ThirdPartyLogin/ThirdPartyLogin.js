import React, { useEffect, useState } from 'react';
import './ThirdPartyLogin.css';
import API_REQUESTS from '../utils/apiCalls';
// import { toast } from 'react-toastify';
import { useSearchParams } from "react-router-dom";

import { Outlet, Routes, Route } from 'react-router-dom';
import Timeline from './TimeLine';

function ThirdPartyLogin() {

  // const previousButtonClicked = localStorage.getItem('activeLink');
  const [searchParams] = useSearchParams();
  searchParams.get('code')
  // const [oauthLinkClicked, setOauthLinkClicked] = useState();
  const [oauthLink, setOauthLink] = useState({ google: '#', spotify: '#' });
  console.log(oauthLink);
  const handleOauthLinkGoogle = (link) => {
    setOauthLink((prevState) => {
      return { ...prevState, google: link }
    })
  }
  const handleOauthLinkSpotify = (link) => {
    setOauthLink((prevState) => {
      return { ...prevState, spotify: link }
    })
  }

  useEffect(() => {
    API_REQUESTS.getOauthLinkGoogle({ setResponse: handleOauthLinkGoogle })
    API_REQUESTS.getOauthLinkSpotify({ setResponse: handleOauthLinkSpotify })
  }, [])

  return (
    <div className='main-container'>
      <div className='title'>
        <Timeline stepsCovered={'stepsCovered'} />
      </div>
      <div className='container'>
        <Outlet />
        <Routes>
          <Route path="/" element={<div>DIV1</div>} />
          <Route path="set-password" element={<div>DIV2</div>} />
        </Routes>
      </div>
    </div>
  )
}

export default ThirdPartyLogin
