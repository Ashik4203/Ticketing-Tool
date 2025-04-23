import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar";
import TicketContainer from "../../components/tickets/ticket-container";
import "../../pages/style/my-ticket.css";

function Ticket() {
  return (
    <>
      <Header />
      <div className="child-container">
        <Sidebar />
        <div className="container">
          <TicketContainer />
        </div>
      </div>
    </>
  );
}

export default Ticket;
