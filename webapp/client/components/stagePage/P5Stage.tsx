import React, { useRef, useEffect } from 'react';

import p5 from "p5"
import '../../styles.css'

const P5Stage = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const RECT_WIDTH: number = 15
  const RECT_HEIGHT: number = 60
  let t:number = 0
  let p5Instance: p5 | null = null; 
  useEffect(() => {
    console.log('useEffect')
    if(canvasRef && canvasRef.current){
        const sketch = (p: p5) => {
          p.setup = () => {
            console.log('Setup')
            p.createCanvas(600, 300).parent(canvasRef.current!);
            p.angleMode(p.DEGREES); // Set the angle mode to degrees
          };


          p.draw = () => {
            p.background(10, 10); // translucent background (creates trails)
          
            //console.log('drawing- props.sprites:', fixturesReference)
            for(let i: number = 0; i< 2; i++){
            
              //the following is the subroutine for creating a Sprite
              p.push(); // Start a new drawing state
              p.rect(-RECT_WIDTH / 2, 0, RECT_WIDTH, RECT_HEIGHT);
              
              p.pop(); // Restore the original drawing state
            }

          };
        };
  
      if (p5Instance) {
        p5Instance.remove();
      }

      p5Instance = new p5(sketch);
    }
    return () => {
      if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
      }
    };
  },[]);



    return (
      <div ref={canvasRef}>
      </div>
    );
};

export default P5Stage;
