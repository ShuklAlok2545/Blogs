import React from "react";
import "./Loader.css";

export const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading content...</p>
    </div>
  );
};

