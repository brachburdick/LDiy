import React from 'react';
// import UIComponent from '../components/UIComponent.jsx'
import { Link } from 'react-router-dom';
import '../styles.css'
import {stateStoreType} from '../redux/reducers/index'
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  // add pertinent state here
  const interfaceState = useSelector((state:stateStoreType)=> state.interface);

  const handleInterfaceSelection = (e) => {
    console.log(e.target.value)
  };



  return(
    <div id="headerBox">
        <h1 id="header">LDIY</h1>
            <Link className="nav-button" to="/">Home</Link>
            <Link className="nav-button" to="/stage">Stage</Link>
            <button onChange={handleInterfaceSelection}>Select DMX Interface</button>
            <p>{interfaceState.connection}</p>
    </div>
  );
}

export default Header;
