import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles.css'
import StagePage from '../components/StagePage'
import Home from '../components/HomePage';
const MainContainer = () => {
  // add pertinent state here
 
  return(
    <div className="container">
        <Routes>
            <Route path="/"element={<Home/>} />
            <Route path="/stage" element={<StagePage/>} />
            {/* <Route path="/contact" component={ContactPage} /> */}
            {/* Add more routes as needed */}
        </Routes>
       
    </div>
  );
}

export default MainContainer;
