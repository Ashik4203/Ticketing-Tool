import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/header/headerright.css"; // Keep using your CSS

const HeaderRight = () => {
  const name = localStorage.getItem("name") ; 
  const email = localStorage.getItem("email") ;
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="header">
      <div className="icons">
        <button className="btn-view-frst" onClick={togglePopup}>
          {name.charAt(0).toUpperCase()}
        </button>

        {showPopup && (
       <div className="profile-popup" ref={popupRef}>
            <div className="popup-avatar">
         <div className="avatar-circle">{name.charAt(0).toUpperCase()}</div>
         
       </div>
       <div className="popup-footer">
       <p className="greeting">Hi, {name}!</p>
         <button className="popup-btn secondary" onClick={handleLogout}>↪ Log out</button>
       </div>
     </div>
     
        )}
      </div>
    </nav>
  );
};

export default HeaderRight;
