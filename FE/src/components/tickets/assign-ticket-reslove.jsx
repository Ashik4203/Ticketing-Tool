import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import { apiService, PORTS } from "../../services/apiService";
import "../../style/tickets/assign-ticket.css";

// Toast Notification
const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "rgba(30,30,60,0.95)",
  color: "#fff",
  customClass: {
    popup: "toast-modern",
    title: "toast-modern__title",
    icon: "toast-modern__icon",
  },
});

const TicketAssignReslove = ({ ticket }) => {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ticketId: ticket?.id,
      statusId: 5,
      comment: comment,
    };

    try {
      const response = await apiService.post("/api/tickets/resolve", payload);

      if (response.message) {
        Toast.fire({
          icon: "success",
          title: "Ticket marked as Resolved!",
        });
        setTimeout(() => navigate("/ticket"), 2500);
      } else {
        Toast.fire({
          icon: "error",
          title: "Error updating ticket status.",
        });
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      Toast.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="form-container">
      <form className="ticket-form" onSubmit={handleSubmit}>
        <h2>Vendor Support Team Status Update</h2>

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
            Resolved
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketAssignReslove;
