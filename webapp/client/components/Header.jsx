import React from 'react';
// import UIComponent from '../components/UIComponent.jsx'
import { Link } from 'react-router-dom';
import '../styles.css'
const Header = () => {
  // add pertinent state here
 


  return(
    <div id="headerBox">
        <h1 id="header">LDIY</h1>
            <Link className="nav-button" to="/">Home</Link>
            <Link className="nav-button" to="/stage">Stage</Link>
              {/* Add more links as needed */}
    </div>
  );
}

export default Header;
