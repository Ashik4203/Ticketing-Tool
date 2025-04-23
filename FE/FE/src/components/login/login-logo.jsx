import React from "react";
import Logo from "../../assets/mytvs.png";
import "../../style/login/login-logo.css";

const LoginLogo = () => {
  return (
    <div className="logo-container">
      <img className="mytvs-logo" src={Logo} alt="MyTVS Logo" />
    </div>
  );
};

export default LoginLogo;
