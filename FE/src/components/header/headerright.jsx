import React from "react";
import share from "../../assets/share.png";
import Question from "../../assets/question-circle.png";
import Sttings from "../../assets/settings.png";
import { useNavigate } from "react-router-dom";
import "../../style/header/headerright.css"; // Import the CSS file

const HeaderRight = () => {
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <nav className="header">
      {/* Right Side: Icons */}
      <div className="icons">
        <button className="btn-view-frst">{name.charAt(0)}</button>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default HeaderRight;
