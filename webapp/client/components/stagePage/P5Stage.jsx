import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import '../../styles.css'

const P5Stage = () => {
  const RECT_WIDTH= 15
  const RECT_HEIGHT=60
  let t = 0
  let p5Instance = null; 
 
  useEffect(() => {
    console.log('useEffect')
    const sketch = (p) => {
      p.setup = () => {
        console.log('Setup')
        p.createCanvas(600, 300) //
        p.angleMode(p.DEGREES); // Set the angle mode to degrees
      };


      p.draw = () => {
        p.background(10, 10); 
      };
    };
    if (p5Instance) {
      p5Instance.remove();
    }

    p5Instance = new p5(sketch);
    return () => {
      if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
      }
    };
  });


  return (
  <div>

  </div>);
};

export default P5Stage;
