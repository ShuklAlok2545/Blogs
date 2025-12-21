import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { auth, loginWithGoogle, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Header.css";

export const Header = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const BaseURI  = 'https://blogs-me15.onrender.com'

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  // Google login
  const handleLogin = async () => {
    try {
      const userData = await loginWithGoogle(); //login-via-google and getting data
      const { uid, displayName, email, photoURL } = userData;
      console.log(photoURL);
      // sending to store unique users 
      await fetch(`${BaseURI}/api/auth/google-login`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId: uid,
          name: displayName,
          email,
          avatar: photoURL,
        }),
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  // Logout
  const handleLogout = async () => {
    await logout();
  };
  


  return (
    <header className="navbar">
      <div className="navbar-logo">NIT SGR 🍁</div>
      <div className={`navbar-wrapper ${menuOpen ? "open" : ""}`}>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/blogs" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
            Blogs
          </NavLink>
        </li>
      </ul>
        <div className="navbar-actions">
          {user ? (
            <div className="user-info">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="user-avatar"
                />
              )}
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={handleLogin}>
                Login
              </button>
              <button className="btn btn-primary" onClick={handleLogin}>
                Signup
              </button>
            </>
          )}
        </div>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
};
