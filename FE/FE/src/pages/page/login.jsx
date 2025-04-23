import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginLeft from "../../components/login/login-left";
import LoginLogo from "../../components/login/login-logo";
import LoginRight from "../../components/login/login-right";
import "../style/login.css";

function Login() {
  return (
    <>
      <div className="Login-container">
        <LoginLeft />
        <LoginLogo />
        <LoginRight />
      </div>
    </>
  );
}

export default Login;
