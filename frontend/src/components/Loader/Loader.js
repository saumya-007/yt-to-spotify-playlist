import React from 'react'
import './Loader.css'

function Loader() {
  return (
    <div className='spinner-wrapper'>
      <div className="lds-roller">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
      <div className="loading-text">Processing your request...</div>
      <div className="loading-subtext">This may take a few moments</div>
    </div>
  )
}

export default Loader