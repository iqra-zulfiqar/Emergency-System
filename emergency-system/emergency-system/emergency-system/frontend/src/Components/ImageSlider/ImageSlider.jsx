import React, { useState, useEffect } from "react";
import plumberimg from "../../assets/plumber.jpg";
import electricianimg from "../../assets/electrician.jpg";
import painterimg from "../../assets/painter.jpg";
import './ImageSlider.css'

function ImageSlider() {
  const images = [plumberimg, electricianimg, painterimg];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slide = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); 

    return () => clearInterval(slide); 
  }, []);

  return (
    <div className="slider">
      <img src={images[current]} alt="slide" />
    </div>
  );
}

export default ImageSlider;
