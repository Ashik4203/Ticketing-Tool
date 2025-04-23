import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar";
import HeadingMain from "../../components/heading";
import Create from "../../components/tickets/ticket-create";
import "../../pages/style/create-ticket.css";

function CreateTicket() {
  return (
    <>
      <Header />
      <div className="main-container">
        <div className="child-container">
          <Sidebar />
          <div className="container">
            <HeadingMain />
            <Create />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTicket;
