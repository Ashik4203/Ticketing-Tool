import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/page/login";
import Ticket from "../src/pages/page/my-ticket";
import Dashboard from "../src/pages/page/dashboard-page";
import Report from "../src/pages/page/report";
import CreateTicket from "../src/pages/page/create-ticket";
import ViewTicket from "../src/pages/page/view-ticket-page";
import CloseTicket from "../src/pages/page/close-ticket-page";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
        <Route path="/ticket" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
        <Route path="/ticket/createticket" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
        <Route path="/ticket/createticket/viewticket" element={<ProtectedRoute><ViewTicket /></ProtectedRoute>} />
        <Route path="/ticket/createticket/closeticket" element={<ProtectedRoute><CloseTicket /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
