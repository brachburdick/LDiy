import React, { useRef, useEffect, useState } from 'react';
const TEST = () => {
const [videoSrc, setVideoSrc] = useState("");

useEffect(() => {
    fetch("/media/v1.mov")
        .then((response) => {console.log(response);return(response.blob())})
        .then((blob) => {
            console.log('blob', blob)
            const videoUrl = URL.createObjectURL(blob);
            setVideoSrc(videoUrl);
        });
}, []);

return (
    <video controls>
        <source src={videoSrc} type="video/mov" />
        Your browser does not support the video tag.
    </video>
);}
export default TEST