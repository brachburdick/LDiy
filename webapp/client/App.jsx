import React, {useState} from 'react'
import { BrowserRouter } from 'react-router-dom';

import MainContainer from './containers/MainContainer.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import './styles.css'

import { Link } from 'react-router-dom';
const App = () =>{
    return (
      <BrowserRouter>
        <div> 
          <Header></Header>
          <MainContainer ></MainContainer>
          <Footer></Footer>
        </div>
      </BrowserRouter>
      );
}
export default App;