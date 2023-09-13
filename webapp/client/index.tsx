import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import { Provider } from 'react-redux';
import store from './store'
import './styles.css'
//import store from './store';
addEventListener('DOMContentLoaded', ()=>{


const root = ReactDOM.createRoot(document.getElementById("root")as HTMLElement)

  

root.render(<Provider store = {store} ><App/></Provider>);})