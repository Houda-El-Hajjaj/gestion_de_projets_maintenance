import React from 'react';

import './CSScomponents/Navbar.css';

function Navbar(){
    return <nav className="nav navbar-light fixed-top bg-white p-2 border ">
      <a href="/home" >
        <img src="\public\logotmp.png" alt="" className="logo" />
      </a>
    
    <ul>
      <li>
        <a href="/profile" className="nav-link bg-light texte-primary">Profile</a>
      </li>
      <li>
        <a href="/" className="nav-link bg-light texte-primary">Log Out</a>
      </li>
    </ul>
  </nav>
}

export default Navbar