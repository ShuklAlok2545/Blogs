import React from "react";
import "./Footer.css";
import { FaLinkedin, FaInstagram, FaFolderOpen, FaWhatsapp } from "react-icons/fa";

export const Footer = () => {
  
  const phoneNumber= '+919991866256'
  const message = "Hello! I found you via your Blogs. Upload some content which i'll provide to you";


  return (
    <footer className="footer">
      <div className="footer-left">
        <p className="stay-connected">Stay connected with us</p>
      </div>

      <div className="footer-center">
        <p>© {new Date().getFullYear()} BlogsIcon. All rights reserved.</p>
      </div>

      <div className="footer-right">
        <a href="https://www.linkedin.com/in/alok-shukla-ack/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://www.instagram.com/shuklalok_.2545/" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
        <a href="https://shuklalokportfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
      <FaFolderOpen  />
    </a>
      </div>
    </footer>
  );
};

