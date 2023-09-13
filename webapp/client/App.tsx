import React, {useState} from 'react'
import { BrowserRouter } from 'react-router-dom';

import MainContainer from './containers/MainContainer'
import Header from './components/Header'
import Footer from './components/Footer'
import './styles.css'
import {useDispatch, useSelector} from 'react-redux'
import {stateStoreType} from './redux/reducers/index';

import { Link } from 'react-router-dom';
const App = () =>{
  const dispatch = useDispatch();
  const interfaceState = useSelector((state:stateStoreType)=> state.interface);
  const stageState = useSelector((state:stateStoreType)=> state.stage);

  const connectToDevice = async () => {
    try {
      const res = await fetch('/dmx/connect', { method: 'POST' });
      const data = await res.json();  // Change this line to parse JSON
      console.log(data.message);  // Access the message property of the parsed JSON object
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };
  
  
  const on = async () => {
    try {
      const res = await fetch('/dmx/on', { method: 'POST' });
      const text = await res.json();
      console.log(text);
    } catch (err) {
      console.error(err);
    }
  };
  
  const off = async () => {
    try {
      const res = await fetch('/dmx/off', { method: 'POST' });
      const text = await res.text();
      console.log(text);
    } catch (err) {
      console.error(err);
    }
  };
  
  const disconnect = async () => {
    try {
      const res = await fetch('/dmx/disconnect', { method: 'POST' });
      const text = await res.text();
      console.log(text);
    } catch (err) {
      console.error(err);
    }
  };
  
    return (
      <BrowserRouter>
        <button onClick={connectToDevice}>Connect to DMX Interface</button>
        <button onClick={on}>Turn On</button>
        <button onClick={off}>Turn Off</button>
        <button onClick={disconnect}>Disconnect</button>
        <div> 
          <Header></Header>
          <MainContainer ></MainContainer>
          <Footer></Footer>
        </div>
      </BrowserRouter>
      );
}
export default App;