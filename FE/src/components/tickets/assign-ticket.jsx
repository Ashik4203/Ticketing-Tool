// src/components/tickets/TicketAssign.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; // SweetAlert2 styles
import { apiService } from "../../services/apiService";
import "../../style/tickets/assign-ticket.css";

// Toast mixin: auto‑close only
const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  background: "rgba(32, 32, 72, 0.85)",
  color: "#fff",
  customClass: {
    popup: "toast-modern",
    title: "toast-modern__title",
    icon: "toast-modern__icon",
  },
  didOpen: undefined,
});

const TicketAssign = ({ ticket }) => {
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(
    ticket.priority || ""
  );
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
        const res = await apiService.post(
          "/api/tickets/vendor-admin",
          formData
        );
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
        statusId: 2, // Assuming 2 = Assigned
        comment,
        priority: selectedPriority,
      };
      const res = await apiService.post(
        "/api/tickets/assign-vendor-admin",
        payload
      );
      if (res.message) {
        Toast.fire({ icon: "success", title: "Vendor Admin assigned!" });
        setTimeout(() => navigate("/ticket", { replace: true }), 1000);
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
        <form className="ticket-form-t" onSubmit={handleSubmit}>
          <div className="assign-section">
            <label>Priority:</label>
            <select
              className="assign-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              required
            >
              <option value="">Select Priority</option>
              {["Low", "Medium", "High", "Critical"].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="assign-section">
            <label>Assign to Vendor Admin:</label>
            <select
              className="assign-select"
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
          <div className="button-groupassign">
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
