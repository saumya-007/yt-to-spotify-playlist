import React, {  useState } from 'react';
import API_REQUESTS from '../../utils/apiCalls'
import { toast } from 'react-toastify';
import './ConverterComponent.css'
import { LuClipboardCopy } from 'react-icons/lu'

function ConverterComponenet({setIsLoading}) {

  const [sourceLink, setSourceLink] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const convertHandler = () => {
    // eslint-disable-next-line no-useless-escape
    const ytRegex = /^https:\/\/youtube\.com\/playlist\?list=[A-Za-z0-9_\-]+&si=[A-Za-z0-9_\-]+$/gm;
    const isInvalid = !ytRegex.test(sourceLink)
    if (isInvalid) toast.error('Invalid playlist URL');

    API_REQUESTS.convertYoutubeData({
      setResponse: setGeneratedLink,
      metaData: {
        playlistName: playlistName,
        playlistUrl: sourceLink,
        userId: localStorage.getItem('userId'),
      },
      setIsLoading
    })

  }

  const copyHanlder = () => {
    if (generatedLink.length === 0) {
      toast.warn('Link not genereated');
      return;
    }
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch((err) => {
        toast.error('Failed to copy link')
        console.error('Failed to copy linkt: ', err);
      });
  }

  return (
    <div className='top-container'>
      <div className='item-wrapper'>
        <div className='source-link-container'>
          <lable>Youtube Playlist Link</lable>
          <input type='text' className='link' onChange={(e) => setSourceLink(e.target.value)} />
          <lable>Playlist Name</lable>
          <input type='text' className='link' onChange={(e) => setPlaylistName(e.target.value)} />
          <input type='button' className='submit-btn' onClick={convertHandler} value={'Convert'} />
        </div>
      </div>
      <div className='item-wrapper'>
        <div className='generated-link-container'>
          <lable>Generated Playlist Link</lable>
          <div className='converted-link-wrapper'>
            <input id='generatedLink' type='text' className='link generated-link' value={generatedLink} />
            <button onClick={copyHanlder} className='copy-btn'><LuClipboardCopy /></button>
          </div>
          <div>
            <a href={generatedLink} className='submit-btn'>Open</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConverterComponenet;
