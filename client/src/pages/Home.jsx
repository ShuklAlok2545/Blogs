import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { Loader } from '../components/Loader.jsx'


import axios from "axios";
import "./Home.css";

export const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loader,setLoader] = useState(true);

  const sliderRef = useRef(null); 

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    centerMode: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1, centerMode: false } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  useEffect(() => {
    axios
      .get("http://localhost:5300/api/home/videos")
    .then((res) => {
      setVideos(res.data.videos)
      setLoader(false);
    })

      .catch((err) => console.error("Error fetching videos:", err));
  }, []);



  const handlePlay = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPause();
    }
  };


  const handleEnded = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  };

  const mainurl = 'https://www.youtube.com/embed/gPfEJLt4nCc?autoplay=1&mute=1&loop=1&playlist=gPfEJLt4nCc&controls=0&modestbranding=1&rel=0&showinfo=0'

  if(loader){
    return (<Loader></Loader>)
  }
  return (
    
    <div className="home">
      <section className="hero">
        {/* <video className="hero-video" autoPlay loop muted playsInline>
          <source
            src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
            type="video/mp4"
          />
        </video> */}

        <iframe
          className="hero-video"
          src={`${mainurl}`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ pointerEvents: "none" }}
        ></iframe>


        <div className="hero-overlay">
          <h1>Explore NIT Srinagar Blogs</h1>
          <p>
          Step into the world of stories, experiences, and creativity from the heart of NIT Srinagar! 🌿 From the scenic Dal Lake mornings to late-night hostel
           tales, from tech innovations to cultural celebrations – the blogs capture the spirit of campus life like never before.
          </p>
          <button className="btn-primary">
         <Link to='/blogs'>Blogs</Link>
          </button>
        </div>
      </section>


      <section className="slider-section">
        <p className="latestb">Latest Blogs</p>
        <Slider ref={sliderRef} {...settings}>
          {videos.length > 0 ? (
            videos.map((video, i) => (
              <div key={i} className="video-slide">
                <div className="video-container">
                  <video
                    controls
                    controlsList="nodownload nofullscreen"
                    disablePictureInPicture
                    autoPlay
                    muted
                    onPlay={handlePlay}
                    onEnded={handleEnded}
                  >
                    <source src={video.url} type="video/mp4" />
                  </video>
                </div>
              </div>
            ))
          ) : (
            <p className="loading-text">Loading videos...</p>
          )}
        </Slider>
      </section>
    </div>
  );
};
