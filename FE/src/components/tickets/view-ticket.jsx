import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../style/tickets/view-ticket.css";
import TicketHistory from "../../components/tickets/ticket-history-tracker";

const TicketRight = ({ ticket }) => {
  const { formId, action } = useParams();
  const navigate = useNavigate();
  const [ticketDetails, setTickets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticket) {
      setTickets(ticket);
      setLoading(false);
    } else {
      setError("No data found.");
    }
  }, [ticket]);

  const getValueOrNA = (value) => value ?? "N/A";

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    let hours = date.getHours();
    const mins = date.getMinutes().toString().padStart(2, "0");
    const secs = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const hh = hours.toString().padStart(2, "0");

    return `${day} ${month} ${year} | ${hh}:${mins}:${secs} ${ampm}`;
  };

  const getStatusColorClass = (statusId) => {
    switch (statusId) {
      case 2:
        return "status-green";
      case 3:
        return "status-blue";
      case 4:
        return "status-yellow";
      case 5:
        return "status-orange";
      case 6:
        return "status-purple";
      case 7:
        return "status-red";
      default:
        return "status-default";
    }
  };

  if (loading) return <p>Loading ticket details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="ticket-details-container">
      <div className="ticket-header">
        <h2 className="ticket-header-h2">
          <b className="ticket-header-b1">
            {getValueOrNA(ticketDetails.project_name)}
          </b>
          <span className="ticket-header-date">
            {formatDateTime(ticketDetails.created_at)}
          </span>
        </h2>
      </div>

      <div className="ticket-field">
        <p>Ticket Number</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.ticket_id)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Project</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.project_name)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Subject</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.subject)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Module</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.module)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Category</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.category)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Priority</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.priority)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Source</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.source)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Status</p>
        <p className="ticket-field-value">
          :{" "}
          <span
            className={`StatusColour ${getStatusColorClass(
              ticket?.ticketsStatus?.id
            )}`}
          >
            {ticket?.ticketsStatus?.status || "N/A"}
          </span>
        </p>
      </div>

      <div className="ticket-field">
        <p>Create Date</p>
        <p className="ticket-field-value">
          : {formatDateTime(ticketDetails.created_at)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Due Date</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.due_date)}
        </p>
      </div>

      <div className="ticket-field">
        <p>Problem Description</p>
        <p className="ticket-field-value">
          : {getValueOrNA(ticketDetails.problem_description)}
        </p>
      </div>

      {/* Ticket History Timeline */}
      <TicketHistory ticketDetails={ticketDetails} />
    </div>
  );
};

export default TicketRight;
