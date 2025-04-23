import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderLeft from "../../components/header/headerleft";
import HeaderRight from "../../components/header/headerright";
import "../../style/header/header.css";

function Header() {
  return (
    <>
      <div className="header">
        <HeaderLeft />
        <HeaderRight />
      </div>
    </>
  );
}

export default Header;
