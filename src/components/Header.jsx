import React from 'react'
import {IoMenu} from 'react-icons/io5'

const Header = (props) => {
  const { handleToggleMenu}=props
  return (
    <header>
      <button onClick={handleToggleMenu}
      className="open-nav-button" style={{display:'flex', alignItems:'center', gap:'10px',justifyContent:'center' }}>
        <IoMenu style={{fontSize:'30px'}}/>
        <h1 className="text-gradient">Pokedex</h1>
      </button>
    </header>
  )
}

export default Header