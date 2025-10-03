import React, { useEffect, useState } from "react";
import axios from "axios";
import "./blogs.css";
import { Loader } from "../components/Loader";
import { MdShare } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa";


export const Blogs = () => {
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);

  const [videoCursor, setVideoCursor] = useState(null);
  const [imageCursor, setImageCursor] = useState(null);

  const [videoHasMore, setVideoHasMore] = useState(true);
  const [imageHasMore, setImageHasMore] = useState(true);

  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(null);

  const [likesCache, setLikesCache] = useState({});

  const [likeCounts, setLikeCounts] = useState({});
  const [shareCounts, setshareCounts] = useState({});


  const BaseURI = 'https://blogs-me15.onrender.com'
  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem("userLikes") || "{}");
    setLikesCache(cache);
  }, []);

  const isItemLiked = (id) => likesCache[id]?.isLiked || false;


  const fetchVideos = async () => {
    if (!videoHasMore) return;
    try {
      const res = await axios.get(`${BaseURI}/api/blogs/videos`, {
        params: { limit: 10, nextCursor: videoCursor },
      });

      if (res.data.videos.length > 0) {
        setVideos((prev) => [
          ...prev,
          ...res.data.videos.filter(
            (v) => !prev.some((p) => p.public_id === v.public_id)
          ),
        ]);
        setVideoCursor(res.data.nextCursor);
        if (!res.data.nextCursor) setVideoHasMore(false);
      } else {
        setVideoHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };


  const fetchImages = async () => {
    if (!imageHasMore) return;
    try {
      const res = await axios.get(`${BaseURI}/api/blogs/images`, {
        params: { limit: 10, nextCursor: imageCursor },
      });

      if (res.data.images.length > 0) {
        setImages((prev) => [
          ...prev,
          ...res.data.images.filter(
            (i) => !prev.some((p) => p.public_id === i.public_id)
          ),
        ]);
        setImageCursor(res.data.nextCursor);
        if (!res.data.nextCursor) setImageHasMore(false);
      } else {
        setImageHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchVideos(), fetchImages()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200
      ) {
        if (videoHasMore) {
          fetchVideos();
        } else if (imageHasMore) {
          fetchImages();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [videoHasMore, imageHasMore, videoCursor, imageCursor]);


  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setSelectedContent(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);




  const sharingVideo = async (obj) => {
    const { url, type, id } = obj;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `share this ${type} content`,
          url: url,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  };


  const liked = async (public_id) => {
    try {
      const current = likesCache[public_id]?.isLiked || false;
      const liking = !current;

      await axios.post(`${BaseURI}/likesCount`, {
        public_id,
        isLiked: liking,
      });

      const updatedCache = {
        ...likesCache,
        [public_id]: { isLiked: liking },
      };
      setLikesCache(updatedCache);
      localStorage.setItem("userLikes", JSON.stringify(updatedCache));
    } catch (err) {
      console.log("error in likes", err);
    }
  };

  useEffect(() => {
    const fetchLikeCounts = async () => {
      try {
        const res = await axios.get(`${BaseURI}/api/totallikes`); 
        setLikeCounts(res.data);
      } catch (err) {
        console.error("Error fetching like counts:", err);
      }
    };
    fetchLikeCounts();
  }, [liked]);


  
  const shared = async (obj) => {
    try {
      await axios.post(`${BaseURI}/shareCount`, obj);
    } catch (err) {
      console.log("error in shares", err);
    }
  };

  useEffect(() => {
    const fetchShareCounts = async () => {
      try {
        const res = await axios.get(`${BaseURI}/api/totalShares`);
        if(res.data){
          setshareCounts(res.data);
        }
      } catch (err) {
        console.error("Error fetching like counts:", err);
      }
    };
    fetchShareCounts();
  }, [shared]);


  const scrollToVideo = (e) => {
    e.preventDefault(); 
    const section = document.getElementById("vdosection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToImages = (e) => {
    e.preventDefault();
    const section = document.getElementById("imgsection");
    if (section) {
      const yOffset = -100;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  

  return (
    <div className="blogs">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="blogs-title" id="vdosection" style={{padding:'2rem'}}>Enjoy the Moments</h1>
          <section className="blogs-section" >
            <h2 className="blogs-subtitle">
              <FaVideo size={24} color="#60a5fa" />
             <a href="#imgsection" className="img-link" onClick={scrollToImages}>
              <FaRegImage className="img-icon"/></a> 
            </h2>
            <div className="blogs-grid">
              {videos.length === 0 ? (
                <p>No videos available</p>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.public_id}
                    className="blogs-item"
                    onClick={() =>
                      setSelectedContent({ type: "video", url: video.url })
                    }
                  >
                    <video controls 
                        controlsList="nodownload nofullscreen"
                        disablePictureInPicture
                        muted
                    >
                      <source src={video.url} type="video/mp4" />
                    </video>


                    <div className="like-share-container">
                      <div className="like">
                    <span
                      className="likes"
                      onClick={(e) => {
                        e.stopPropagation();
                        liked(video.public_id);
                      }}
                    >
                      <FaRegHeart 
                        color={isItemLiked(video.public_id) ? "red" : "gray"}
                      />
                      <span className="likes-count">{likeCounts[video.public_id] || 0}</span>
                    </span>
                    </div>

                      <div className="share">
                    <span
                      className="sharing"
                      onClick={(e) => {
                        e.stopPropagation();
                        sharingVideo({
                          url: video.url,
                          type: "video",
                          id: video.public_id,
                        });
                        shared({ id: video.public_id });
                      }}
                    >
                      
                      <MdShare style={{color:'#0088CC'}}/>
                      <span className="likes-count" >{shareCounts[video.public_id]}</span>
                    </span>
                    </div>
                    </div>

                    {copied === video.public_id && (
                      <div className="share-popup">Link copied!</div>
                    )}
                  </div>
                ))
              )}
            </div>
            {!videoHasMore && <p className="end">No more videos</p>}
          </section>

          <section className="blogs-section"  id="imgsection">
            <h2 className="blogs-subtitle">
            <FaRegImage size={24} className="image-icon"/> 
            <a href="#vdosection" className="video-link" onClick={scrollToVideo}>
            <FaVideo className="video-icon" size={24}/>
            </a>
            
            </h2>
            <div className="blogs-grid">
              {images.length === 0 ? (
                <p>No images available</p>
              ) : (
                images.map((image) => (
                  <div
                    key={image.public_id}
                    className="blogs-item"
                    onClick={() =>
                      setSelectedContent({ type: "image", url: image.url })
                    }
                  >
                    <img src={image.url} alt="blog" loading="lazy" />
                  <div className="like-share-container">
                    <div>
                    <span
                      className="likes"
                      onClick={(e) => {
                        e.stopPropagation();
                        liked(image.public_id);
                      }}
                    >
                      <FaRegHeart
                        color={isItemLiked(image.public_id) ? "red" : "gray"}
                      />
                      <span className="likes-count">{likeCounts[image.public_id] || 0}</span>
                    </span>
                    </div>
                    <div>
                      <span
                        className="sharing"
                        onClick={(e) => {
                          e.stopPropagation();
                          sharingVideo({
                            url: image.url,
                            type: "image",
                            id: image.public_id,
                          });
                          shared({ id: image.public_id });
                        }}
                      >
                          <MdShare />
                        <span className="likes-count" >{shareCounts[image.public_id]}</span>
                        
                      </span>
                    </div>
                  </div>

                    {copied === image.public_id && (
                      <div className="share-popup">Link copied!</div>
                    )}
                  </div>
                ))
              )}
            </div>
            {!imageHasMore && <p className="end">No more images</p>}
          </section>

          {selectedContent && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedContent(null)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setSelectedContent(null)}
                >
                  ✖
                </button>
                {selectedContent.type === "image" ? (
                  <img src={selectedContent.url} alt="fullscreen" />
                ) : (
                  <video controls autoPlay>
                    <source src={selectedContent.url} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
