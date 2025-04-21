import React from "react";
import SmartTrackerL from "../../assets/Smart-Tracker-Logo.png";
import "../../style/header/headerleft.css";

const HeaderLeft = () => {
  return (
    <nav className="header">
      <div className="header-container">
        {/* Left Side: Logo */}
        <a className="logo" href="#">
          <img src={SmartTrackerL} alt="Logo" className="logo-img" />
        </a>
      </div>
    </nav>
  );
};

export default HeaderLeft;
