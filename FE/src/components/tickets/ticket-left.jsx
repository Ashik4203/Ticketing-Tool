import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../../style/tickets/ticket-left.css";
import { apiService, PORTS } from "../../services/apiService";
import TicketAssign from "./assign-ticket"; // Import TicketAssign component
import TicketAssignVendor from "./assign-ticket-vendor"; // Import
import TicketAssignVendorAcknowledged from "./assign-ticket-vendor-acknowledge"; // Import
import TicketAssignReslove from "./assign-ticket-reslove"; // Import
import TicketView from "./view-ticket";
import TicketClose from "./close-ticket";
import {
  FaUserPlus,
  FaCheckCircle,
  FaSpinner,
  FaRegClock,
  FaRegCheckCircle,
} from "react-icons/fa";
import ViewIcon from "../../assets/View-Icon.png";

const TicketLeft = ({ filters }) => {
  console.log(filters, "filters data");
  const location = useLocation();
  const role = parseInt(localStorage.getItem("role_id"));
  const { formId, action } = useParams();
  const [ticketClose, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicketAssign, setSelectedTicketAssign] = useState(null);
  const [selectedTicketAssignVendor, setSelectedTicketAssignVendor] =
    useState(null);
  const [
    selectedTicketAssignVendorcknowledge,
    setSelectedTicketAssignVendorcknowledge,
  ] = useState(null);
  const [selectedTicketAssignReslove, setSelectedTicketAssignReslove] =
    useState(null);
  const [selectedTicketView, setSelectedTicketView] = useState(null);
  const [selectedTicketClose, setSelectedTicketClose] = useState(null);
  const ticketsPerPage = 3;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const assigned = queryParams.get("assigned");

    if (assigned) {
      console.log("Assigned param:", assigned);
    }
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(`${key}`, filters[key]);
      }
    });
    const fetchTicketDetails = async () => {
      try {
        let response;
        console.log("API URL:", `api/tickets?${queryParams.toString()}`);
        if (assigned === "yes") {
          response = await apiService.get(
            `api/tickets/assigned/myself?${queryParams.toString()}`
          );
        } else {
          response = await apiService.get(
            `api/tickets?${queryParams.toString()}`
          );
        }

        console.log("API Response:", response); // Log the entire response for inspection

        if (response && response.tickets) {
          setTickets(response.tickets);
        } else {
          setError("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error); // Log the actual error
        setError("Failed to load ticket details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [filters, formId, action, location]);

  if (loading) return <p>Loading ticket details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // Pagination Logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = ticketClose.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  const handleNext = () => {
    if (currentPage < Math.ceil(ticketClose.length / ticketsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAssignClick = (ticket) => {
    setSelectedTicketAssign(ticket);
    setSelectedTicketView(null);
    setSelectedTicketClose(null);
    setSelectedTicketAssignVendor(null);
    setSelectedTicketAssignVendorcknowledge(null);
    setSelectedTicketAssignReslove(null);
  };

  const handleAssignVendorAdminEmployeeClick = (ticket) => {
    setSelectedTicketAssign(null);
    setSelectedTicketAssignVendor(ticket);
    setSelectedTicketAssignVendorcknowledge(null);
    setSelectedTicketAssignReslove(null);
    setSelectedTicketView(null);
    setSelectedTicketClose(null);
  };

  const handleAssignAcknowledgeClick = (ticket) => {
    setSelectedTicketAssign(null);
    setSelectedTicketAssignVendor(null);
    setSelectedTicketAssignVendorcknowledge(ticket);
    setSelectedTicketAssignReslove(null);
    setSelectedTicketView(null);
    setSelectedTicketClose(null);
  };

  const handleResloveClick = (ticket) => {
    setSelectedTicketAssign(null);
    setSelectedTicketAssignVendor(null);
    setSelectedTicketAssignReslove(ticket);
    setSelectedTicketAssignVendorcknowledge(null);
    setSelectedTicketView(null);
    setSelectedTicketClose(null);
  };

  const handleViewClick = (ticket) => {
    setSelectedTicketView(ticket);
    setSelectedTicketAssignVendor(null);
    setSelectedTicketAssignVendorcknowledge(null);
    setSelectedTicketAssignReslove(null);
    setSelectedTicketAssign(null);
    setSelectedTicketClose(null);
  };

  const handleCloseClick = (ticket) => {
    setSelectedTicketClose(ticket);
    setSelectedTicketView(null);
    setSelectedTicketAssign(null);
    setSelectedTicketAssignVendor(null);
    setSelectedTicketAssignVendorcknowledge(null);
    setSelectedTicketAssignReslove(null);
  };

  const handleClosePopup = () => {
    setSelectedTicketView(null);
    setSelectedTicketClose(null);
    setSelectedTicketAssign(null);
    setSelectedTicketAssignVendor(null);
    setSelectedTicketAssignVendorcknowledge(null);
    setSelectedTicketAssignReslove(null);
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

  return (
    <div className="TicketBox">
      <div className="Ticket-Container">
        {currentTickets.length > 0 ? (
          currentTickets.map((ticket) => (
            <div key={ticket.ticket_id} className="TicketDetails">
              {/* Top Row */}
              <div className="Top-Text">
                <div className="Ticket-No-Bg">
                  <span className="Ticket-No">
                    #{ticket.ticket_id ?? "N/A"}
                  </span>
                </div>
                <div
                  className={`StatusColor ${getStatusColorClass(
                    ticket.ticketsStatus.id
                  )}`}
                >
                  {ticket.ticketsStatus.status || "N/A"}
                </div>
              </div>

              {/* Middle Row */}
              <div className="TicketName">{ticket.subject || "N/A"}</div>

              <div className="bottomDetailsbtn">
                {/* Bottom Row */}
                <div className="AssignDetails">
                  <div className="Column">
                    <span className="Text">Project</span>
                    <span className="Text1">
                      {ticket.project.name || "N/A"}
                    </span>
                  </div>
                  <div className="Column">
                    <span className="Text">Due Date</span>
                    <span className="Text1">{ticket.due_date || "N/A"}</span>
                  </div>
                  <div className="Column">
                    <span className="Text">Behalf</span>
                    <span className="Text1">{ticket.behalf_of || "N/A"}</span>
                  </div>
                  <div className="Column">
                    <span className="Text">Priority</span>
                    <span className="Text1">{ticket.priority || "N/A"}</span>
                  </div>
                  <div className="Column">
                    <span className="Text">Created By</span>
                    <span className="Text1">
                      {ticket.createdBy.name || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <button
                  className="btn-view"
                  onClick={() => handleViewClick(ticket)}
                >
                  <img src={ViewIcon} alt="View" width="20" height="20" />
                </button>
                {location.search.includes("assigned=yes") && (
                  <div className="btn">
                    {role === 3 && ticket.ticketsStatus.id === 1 && (
                      <TicketAssign ticket={ticket} />
                    )}
                    {role === 4 && ticket.ticketsStatus.id === 2 && (
                      <TicketAssignVendor ticket={ticket} />
                    )}
                    {role === 5 && ticket.ticketsStatus.id === 3 && (
                      <TicketAssignVendorAcknowledged ticket={ticket} />
                    )}
                    {role === 5 && ticket.ticketsStatus.id === 4 && (
                      <TicketAssignReslove ticket={ticket} />
                    )}
                    {role === 6 && ticket.ticketsStatus.id === 5 && (
                      <button
                        className="btn-close"
                        onClick={() => handleCloseClick(ticket)}
                      >
                        <FaRegCheckCircle style={{ marginRight: "8px" }} />{" "}
                        Close
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="NoTickets">No tickets available</div>
        )}

        {/* Pagination Controls */}
        <div className="pagination">
          <span>
            Page {currentPage} of{" "}
            {Math.ceil(ticketClose.length / ticketsPerPage)}
          </span>
          <button
            className="pagination-btn"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <h4 className="pagination-h4">Prev</h4>
          </button>

          <button
            className="pagination-btn"
            onClick={handleNext}
            disabled={
              currentPage >= Math.ceil(ticketClose.length / ticketsPerPage)
            }
          >
            <h4 className="pagination-h4">Next</h4>
          </button>
        </div>
      </div>

      {/* Popup for TicketAssign */}
      {selectedTicketAssign && (
        <div
          className={`popup-overlay ${selectedTicketAssign ? "active" : ""}`}
        >
          <div className="popup-content">
            <button className="popup-close-button" onClick={handleClosePopup}>
              ×
            </button>
            <TicketAssign ticket={selectedTicketAssign} />
          </div>
        </div>
      )}

      {/* Popup for TicketAssignVendor */}
      {selectedTicketAssignVendor && (
        <div
          className={`popup-overlay ${
            selectedTicketAssignVendor ? "active" : ""
          }`}
        >
          <div className="popup-content">
            <button className="popup-close-button" onClick={handleClosePopup}>
              ×
            </button>
            <TicketAssignVendor ticket={selectedTicketAssignVendor} />
          </div>
        </div>
      )}

      {/* Popup for TicketAssignVendorAcknowledged */}
      {selectedTicketAssignVendorcknowledge && (
        <div
          className={`popup-overlay ${
            selectedTicketAssignVendorcknowledge ? "active" : ""
          }`}
        >
          <div className="popup-content">
            <button className="popup-close-button" onClick={handleClosePopup}>
              ×
            </button>
            <TicketAssignVendorAcknowledged
              ticket={selectedTicketAssignVendorcknowledge}
            />
          </div>
        </div>
      )}

      {/* Popup for TicketAssignReslove */}
      {selectedTicketAssignReslove && (
        <div
          className={`popup-overlay ${
            selectedTicketAssignReslove ? "active" : ""
          }`}
        >
          <div className="popup-content">
            <button className="popup-close-button" onClick={handleClosePopup}>
              ×
            </button>
            <TicketAssignReslove ticket={selectedTicketAssignReslove} />
          </div>
        </div>
      )}

      {/* Popup for TicketView */}
      {selectedTicketView && (
        <div className={`popup-overlay ${selectedTicketView ? "active" : ""}`}>
          <div className="popup-content">
            <button className="popup-close-button" onClick={handleClosePopup}>
              ×
            </button>
            <TicketView ticket={selectedTicketView} />
          </div>
        </div>
      )}

      {/* Popup for TicketClose */}
      {selectedTicketClose && (
        <div className={`popup-overlay ${selectedTicketClose ? "active" : ""}`}>
          <div className="popup-content">
            <button className="popup-close-button" onClick={handleClosePopup}>
              ×
            </button>
            <TicketClose ticket={selectedTicketClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketLeft;
