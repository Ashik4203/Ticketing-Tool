import React from "react";
import SideImage from "../../assets/backgroundshadow.png";
import "../../style/login/login-left.css";

const LoginLeft = () => {
  return (
    <>
      <div className="login-container">
        <img
          className="backgroundshadow"
          src={SideImage}
          alt="Background shadow"
        />
      </div>
    </>
  );
};

export default LoginLeft;
