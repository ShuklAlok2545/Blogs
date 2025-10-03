import React, { useState } from "react";
import axios from "axios";
import "./Admin.css";

export const Admin = () => {
  const [mail, setMail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [token, setToken] = useState(null);
  const [file, setFile] = useState(null);

  const API_BASE = "https://blogs-me15.onrender.com";

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
        alert("✅ Login successful");
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
        alert(`✅ Uploaded: ${res.data.url}`);
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
        <h2>Admin Panel</h2>

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
            <h2>Upload Video or Image</h2>
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
