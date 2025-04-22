import React from "react";
import { useNavigate } from "react-router-dom";
import SmartTrackerL from "../../assets/Smart-Tracker-Logo.png";
import "../../style/header/headerleft.css";

const HeaderLeft = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="header">
      <div className="header-container">
        {/* Left Side: Logo */}
        <button className="logo" onClick={handleLogoClick}>
          <img src={SmartTrackerL} alt="Logo" className="logo-img" />
        </button>
      </div>
    </nav>
  );
};

export default HeaderLeft;
