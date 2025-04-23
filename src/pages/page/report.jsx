import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar";
import Report from "../../components/report"; // Ensure unique name

function ReportPage() {
  return (
    <>
      <Header />
      <div className="child-container">
        <Sidebar />
        <div className="container">
          <Report />
        </div>
      </div>
    </>
  );
}

export default ReportPage;
