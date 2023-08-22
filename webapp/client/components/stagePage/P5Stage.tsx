import React, { useState, useRef, useEffect } from 'react';

import p5 from "p5"
import '../../styles.css'
import {useDispatch, useSelector} from 'react-redux';

const P5Stage = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const dispatch = useDispatch();
  const state:any = useSelector(state => state);
  
  const RECT_WIDTH: number = 15
  const RECT_HEIGHT: number = 60
  let t:number = 0
  let p5Instance: p5 | null = null; 
  const DIAM = 25
  const STAGE_WIDTH = 600;
  const STAGE_HEIGHT = 300;
  const handleClick = ()=>{
    console.log("state", state)
  }

  useEffect(() => {
    console.log('useEffect')
    if(canvasRef && canvasRef.current){
        const sketch = (p: p5) => {
          let video;


          p.setup = () => {
            console.log('Setup')
            p.createCanvas(STAGE_WIDTH,STAGE_HEIGHT).parent(canvasRef.current!);
            video = p.createVideo("/media/v1.mov")
            // video.hide();
          };


          p.draw = () => {
            p.image(video,0,0);

            // p.background(10, 10); // translucent background (creates trails)
            const allFixtures = state?.stage?.fixtures?.byId
            // for(let each in allFixtures){
            //   const x = allFixtures[each].tx
            //   const y =  STAGE_HEIGHT-allFixtures[each].ty
            //   const [R,G,B,A] = video.get(x,y);

              
            //   p.push(); // Start a new drawing state
            //   p.circle(x,y,DIAM);
            //   p.fill(R,G,B,A)
            //   p.pop(); // Restore the original drawing state
            // }

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
      <>
        <div ref={canvasRef}></div>
        {/* <video ref={videoRef} src="/media/v1.mov"></video> */}
        <video width="320" height="240" autoPlay >
                <source src="/media/v1.mov" type="video/quicktime"  />
                Your browser does not support the video tag.
            </video>
        <button onClick = {() => handleClick()}> BUTTON</button>

      </>
    );
};

export default P5Stage;
