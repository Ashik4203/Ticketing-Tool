import React from "react";
import "../../style/tickets/tickets-heading.css"; // Ensure the correct file extension
import { useParams, useLocation } from "react-router-dom";
const Heading = () => {
  const location = useLocation();
  const role = parseInt(localStorage.getItem("role_id"));
  const queryParams = new URLSearchParams(location.search);
  const assigned = queryParams.get("assigned");
  let headingText = "Ticket List";
  if (assigned === "yes") {
    if (role === 2) {
      headingText = "All Assigned Tickets";
    }
    if (role === 3) {
      headingText = "Assign Tickets";
    } else {
      headingText = "Assigned Tickets";
    }
  } else {
    headingText = "My Tickets";
  }

  return (
    <div className="heading-text">
      {/* Fixed className */}
      <h3 className="head-text">{headingText}</h3>
    </div>
  );
};

export default Heading;
