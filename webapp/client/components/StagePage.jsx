import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import '../styles.css'
import AboveStage from './stagePage/AboveStage.jsx';
import P5Stage from './stagePage/P5Stage.jsx';
import BelowStage from './stagePage/BelowStage.jsx'
const StagePage = () => {
 

  return (
  <div id = 'stagepage'>
    <AboveStage/>
    <div>
      <P5Stage/>
    </div>
    <BelowStage/>
  </div>);
};

export default StagePage;
