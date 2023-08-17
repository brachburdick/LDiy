import React, {useState} from 'react'
import { BrowserRouter } from 'react-router-dom';

import MainContainer from './containers/MainContainer'
import Header from './components/Header'
import Footer from './components/Footer'
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