import React, { useRef, useEffect } from 'react';
import p5 from 'react-p5';
import '../styles.css'
import AboveStage from './stagePage/AboveStage';
import P5Stage from './stagePage/P5Stage';
import BelowStage from './stagePage/BelowStage'
import TEST from './stagePage/test'
const StagePage = () => {
 

  return (
  <div id = 'stagepage'>
    <AboveStage/>
    <P5Stage/>
    <TEST/>
    <BelowStage/>
  </div>);
};

export default StagePage;
