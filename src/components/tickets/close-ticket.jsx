import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, PORTS } from "../../services/apiService";
import "../../style/tickets/assign-ticket.css";

const TicketClose = ({ ticket }) => {
  console.log(ticket, "ticket data");
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [comment, setComment] = useState("");
  // const [projectId, setProjectId] = useState(ticket?.project?.id || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

  });

  const handleAssigneeChange = (e) => {
    setSelectedAssignee(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ticketId: ticket?.id,
      // vendorAdminId: selectedAssignee,
      statusId: 6,
      comment: comment,
    };

    try {
      const response = await apiService.post("/api/tickets/resolve", payload);

      if (response.message) {
        alert("Vendor Support Team status has been changed!");
        navigate("/ticket");
      } else {
        alert("Error Vendor Support Team status. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning vendor admin:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="form-container">
     
        <form className="ticket-form" onSubmit={handleSubmit}>
          <h2>User Need to Close the Ticket</h2>



          <div className="comment-section">
            <label>Comment:</label>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              required
              rows="4"
            ></textarea>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/ticket")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
            Closed
            </button>
          </div>
        </form>
      
    </div>
  );
};

export default TicketClose;
