import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles.css'
import StagePage from '../components/StagePage'
import Home from '../components/HomePage';
import QuidAddition from '../components/QuidAddition';
const MainContainer = () => {
  // add pertinent state here
 
  return(
    <div className="container">
        <Routes>
            <Route path="/"element={<Home/>} />
            <Route path="/stage" element={<StagePage/>} />
            <Route path="/AddFixture" element={<QuidAddition/>} />
            {/* Add more routes as needed */}
        </Routes>
       
    </div>
  );
}

export default MainContainer;
