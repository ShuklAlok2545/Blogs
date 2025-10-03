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
        <p>© {new Date().getFullYear()} NIT SGR 🍁 . All rights reserved.</p>
      </div>

      <div className="footer-right">
        <a href="https://www.linkedin.com/in/alok-shukla-ack/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin style={{color:'#0A66C2'}} />
        </a>
        <a href="https://www.instagram.com/shuklalok_.2545/" target="_blank" rel="noopener noreferrer">
          <FaInstagram  style={{background:'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
}}/>
        </a>
        <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp style={{color:'#25D366'}}/>
        </a>
        <a href="https://shuklalokportfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
      <FaFolderOpen  style={{color:'#4A90E2'}}/>
    </a>
      </div>
    </footer>
  );
};

