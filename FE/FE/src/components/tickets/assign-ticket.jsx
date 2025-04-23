// src/components/tickets/TicketAssign.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";   // SweetAlert2 styles
import { apiService } from "../../services/apiService";
import "../../style/tickets/assign-ticket.css";

// Toast mixin: auto‑close only
const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 3000,               // auto‑close after 3s
  timerProgressBar: true,
  background: "rgba(32, 32, 72, 0.85)",
  color: "#fff",
  customClass: {
    popup: "toast-modern",
    title: "toast-modern__title",
    icon: "toast-modern__icon",
  },
  // No pause on hover:
  didOpen: undefined,
});

const TicketAssign = ({ ticket }) => {
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load assignees
  useEffect(() => {
    (async () => {
      try {
        const formData = new FormData();
        formData.append("project_id", ticket?.project?.id || "");
        const res = await apiService.post("/api/tickets/vendor-admin", formData);
        setAssignees(res.data || []);
      } catch {
        setError("Failed to load vendor admin list.");
      } finally {
        setLoading(false);
      }
    })();
  }, [ticket]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ticketId: ticket.id,
        vendorAdminId: selectedAssignee,
        statusId: 2,
        comment,
      };
      const res = await apiService.post(
        "/api/tickets/assign-vendor-admin",
        payload
      );
      if (res.message) {
        Toast.fire({ icon: "success", title: "Vendor Admin assigned!" });
        setTimeout(() => navigate("/ticket", { replace: true }), 3000);
      } else {
        Toast.fire({ icon: "error", title: "Could not assign vendor admin." });
      }
    } catch {
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
          <h2>Assign Vendor Admin</h2>
          <div className="assign-section">
            <label>Assign to Vendor Admin:</label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              required
            >
              <option value="">Select Vendor Admin</option>
              {assignees.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="comment-section">
            <label>Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              required
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/ticket", { replace: true })}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Assign
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TicketAssign;
