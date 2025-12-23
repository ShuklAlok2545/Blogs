import React, { use, useState } from "react";
import axios from "axios";
import "./DeletePost.css";
import { MdDelete } from "react-icons/md";


export const DeletePost = () => {
  const [allposts, setAllPosts] = useState([]);
  const [dltpost,setDltpost] = useState(false);

  // const BaseURI = "http://localhost:5300";
  const BaseURI = "https://blogs-me15.onrender.com";

  const getposts = async () => {
    try {
      const ans = await axios.get(`${BaseURI}/api/getallposts`);
      setAllPosts(ans.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderMedia = (post) => {
    if (post.fileType === "video") {
      return <video src={post.secure_url} controls />;
    }
    return <img src={post.secure_url} alt="uploaded file" />;
  };

  // Separate videos and images
  const images = allposts.filter(post => post.fileType === "image");
  const videos = allposts.filter(post => post.fileType === "video");


  const onDelete = async (post) => {
    setDltpost(true)
    const res = await axios.post(`${BaseURI}/api/deletepost`, post);
    await getposts();
    setDltpost(res.data);
    setTimeout(() => {
      setDltpost(false);
    }, 6000);    
    console.log(res.data)
  }




  return (
    <div className="delete-post-container">
      {!allposts.length&&<button onClick={getposts} className="fetch-btn">Get Posts to Delete</button>}
      {dltpost && <p className="pstdlt">Post deleted from device but accessible in cloud!</p>}
      {images.length > 0 && (
        <>
          <h2>Images</h2>
          <div className="grid-container image-grid">
            {images.map(post => (
                
              <div className="grid-item" key={post._id}>
                
                {renderMedia(post)}
                <div id="dlticon"><MdDelete className="ondlt" onClick={()=>onDelete(post)}></MdDelete></div>
                <p className="timestamp">{new Date(post.createdAt).toLocaleString()} </p>
                
              </div>
            ))}
          </div>
        </>
      )}

      {videos.length > 0 && (
        <>
          <h2>Videos</h2>
          <div className="grid-container video-grid">
            {videos.map(post => (
              <div className="grid-item" key={post._id}>
                
                {renderMedia(post)}
                <div id="dlticon"><MdDelete className="ondlt" onClick={()=>onDelete(post)}></MdDelete></div>
                <p className="timestamp">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
