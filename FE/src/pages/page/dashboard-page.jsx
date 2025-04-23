import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar";
import DashboardMain from "../../components/dashboard"; // Ensure unique name

function DashboardPage() {
  return (
    <>
      <Header />
      <div className="child-container">
        <Sidebar />
        <div className="container">
          <DashboardMain />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
