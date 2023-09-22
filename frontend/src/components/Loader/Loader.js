import React from 'react'
import './Loader.css'

function Loader() {
  return (
    <div className='spinner-wrapper'>
      <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loader