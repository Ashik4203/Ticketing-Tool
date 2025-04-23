import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import badgeImg from "../assets/fi-rs-badge.png";
import bookImg from "../assets/fi-rs-book.png";
import diplomaImg from "../assets/total-tickets.png";
import { apiService } from "../services/apiService"; // API service

const Dashboard = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total tickets
        const totalTicketsResponse = await apiService.get("api/tickets/ticket/dashboard-total");
        setTotalTickets(totalTicketsResponse.totalTickets);

         // Fetch open tickets count
         const openTicketsResponse = await apiService.get("api/tickets/ticket/dashboard-open");
         setOpenTickets(openTicketsResponse.count);
 
         // Fetch closed tickets count
         const closedTicketsResponse = await apiService.get("api/tickets/ticket/dashboard-closed");
         setClosedTickets(closedTicketsResponse.count);

        // Fetch weekly ticket data
        const weeklyResponse = await apiService.get("api/tickets/ticket/dashboard-weekly");
        setWeeklyData(weeklyResponse);

        // Fetch monthly ticket data
        const monthlyResponse = await apiService.get("api/tickets/ticket/dashboard-monthly");
        setMonthlyData(monthlyResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs once on component mount

  return (
    <div className="dashboard">
      <h2 className="heading">Dashboard</h2>
      <div className="cards">
        <div className="card total-tickets">
          <div className="icon-container1">
            <img className="first-icon" src={diplomaImg} alt="Total Tickets" />
          </div>
          <div className="ticket-name">
            <h4>Total Tickets</h4>
            <h2>{totalTickets}</h2>
          </div>
        </div>
        <div className="card open-tickets">
          <div className="icon-container2">
            <img className="first-icon" src={bookImg} alt="Open Tickets" />
          </div>
          <div className="ticket-name">
            <h4>Open Ticket</h4>
            <h2>{openTickets}</h2>
          </div>
        </div>
        <div className="card closed-tickets">
          <div className="icon-container3">
            <img className="first-icon" src={badgeImg} alt="Closed Tickets" />
          </div>
          <div className="ticket-name">
            <h4>Closed Ticket</h4>
            <h2>{closedTickets}</h2>
          </div>
        </div>
      </div>
      <div className="charts">
        <div className="chart-weekly">
          <h3>Weekly Tickets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-monthly">
          <h3>Monthly Tickets</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#00AEEF" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
