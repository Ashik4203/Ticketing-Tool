import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/tickets/ticket-right.css";

const TicketRight = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ticket details from API
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(
          "https://mocki.io/v1/e40288c9-c9cd-438b-a3e0-e4175c2273b0"
        );

        if (response.data && Array.isArray(response.data)) {
          setTicketDetails(response.data);
        } else {
          setError("No ticket details found.");
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        setError("Failed to load ticket details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, []);

  if (loading) {
    return <p>Loading ticket details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Fallback function for missing values
  const getValueOrNA = (value) => value ?? "N/A";

  return (
    <div className="DetailBox">
      <div className="Deatil-1">
        {ticketDetails.length > 0 ? (
          ticketDetails.map((detail, index) => (
            <div key={index} className="Detail">
              <p className="text">{getValueOrNA(detail.label)}</p>
              <p className={detail.className || "default-class"}> : </p>
              <p className="text">{getValueOrNA(detail.value)}</p>
            </div>
          ))
        ) : (
          <p>No details available.</p>
        )}
      </div>
    </div>
  );
};

export default TicketRight;
