import React, { useState, useEffect } from "react";
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
  timer: 1000,
  timerProgressBar: true,
  background: "rgba(30,30,60,0.95)",
  color: "#fff",
  customClass: {
    popup: "toast-modern",
    title: "toast-modern__title",
    icon: "toast-modern__icon",
  },
});

const TicketAssignVendor = ({ ticket }) => {
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [comment, setComment] = useState("");
  const [projectId, setProjectId] = useState(ticket?.project?.id || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const assigneeResponse = await apiService.post(
          "/api/tickets/vendor-employee"
        );
        if (assigneeResponse.data) {
          setAssignees(assigneeResponse.data || []);
        } else {
          setError("Failed to load vendor Employee list.");
        }
      } catch (error) {
        console.error("Error fetching vendor Employee list:", error);
        setError("Error fetching vendor Employee list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignees();
  }, [projectId]);

  const handleAssigneeChange = (e) => setSelectedAssignee(e.target.value);
  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ticketId: ticket?.id,
      vendorEmployeeId: selectedAssignee,
      statusId: 3,
      comment,
    };

    try {
      const response = await apiService.post(
        "/api/tickets/assign-vendor-employee",
        payload
      );

      if (response.message) {
        Toast.fire({
          icon: "success",
          title: "Vendor Employee assigned successfully!",
        });
        setTimeout(() => navigate("/ticket"), 1000);
      } else {
        Toast.fire({
          icon: "error",
          title: "Error assigning vendor employee.",
        });
      }
    } catch (error) {
      console.error("Error assigning vendor employee:", error);
      Toast.fire({ icon: "error", title: "Something went wrong." });
    }
  };

  return (
    <div className="form-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <form className="ticket-form" onSubmit={handleSubmit}>
          <h2>Assign Vendor Employee</h2>

          <div className="assign-section">
            <label>Assign to Vendor Employee:</label>
            <select
              value={selectedAssignee}
              onChange={handleAssigneeChange}
              required
            >
              <option value="">Select Vendor Employee</option>
              {assignees.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

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
              Acknowledged
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TicketAssignVendor;
