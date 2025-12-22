import React, { useState } from "react";
import axios from "axios";
import "./Admin.css";
import {FaWhatsapp } from "react-icons/fa";
export const Admin = () => {
  const [mail, setMail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [token, setToken] = useState(null);
  const [file, setFile] = useState(null);

  const API_BASE = "https://blogs-me15.onrender.com";
  // const API_BASE = "http://localhost:5300";

  const phoneNumber= '+919991866256'
  const message = "Hello! I found you via your BlogsPage.Please provide me mail and password to upload some good content";

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        mail,
        password: passkey,
      });

      if (res.data.token) {
        setToken(res.data.token);
        //alert("✅ Login successful");
        // let btn = document.getElementsByClassName('btn').innerText
        // console.log(btn)
        setMail("");
        setPasskey("");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "❌ Login failed");
    }
  };

  // file upload handler
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must log in first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.url) {
        //alert(`✅ Uploaded: ${res.data.url}`);
        // let btn = document.getElementsByClassName('btn').value.trim()
        // console.log(btn)
        setFile(null);
        e.target.reset();
        setToken(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "❌ Upload failed");
    }
  };


  return (
    <div className="page-wrapper">
      <div className="admin-container">
        
        {
          !token ? (<h2>Admin Panel</h2>):(<h2>Access Granted</h2>)
        }
        {!token && (
          <a id="adminmsg" href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp style={{color:'#25D366'}} size={26}/>
          <p id="admsg">Get email and password from admin via Whatsapp.</p>
        </a>
        )}
        

        {/* Shows login form when no token */}
        {!token && (
          <form className="form-container" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
            />
            <button className="btn" type="submit">
              Login
            </button>
          </form>
        )}

        {/* Shows upload form when logged in */}
        {token && (
          <>
            <h3>Upload Video or Image</h3>
            <p>content must be less then 50 mb and format shuold be (jpg, img, mp4)</p>
            <form className="form-container-file" onSubmit={handleUpload}>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <button className="btn" type="submit">
                Upload
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
