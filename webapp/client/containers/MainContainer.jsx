import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles.css'
import StagePage from '../components/StagePage.jsx'
import Home from '../components/HomePage.jsx';
const MainContainer = () => {
  // add pertinent state here
 
  return(
    <div className="container">
        <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path="/stage" element={<StagePage/>} />
            {/* <Route path="/contact" component={ContactPage} /> */}
            {/* Add more routes as needed */}
        </Routes>
       
    </div>
  );
}

export default MainContainer;
