import React, { useState } from "react";
import Heading from "../../components/tickets/tickets-heading";
import Filter from "../../components/tickets/create-filter";
import TicketLeft from "../../components/tickets/ticket-left";
import "../../style/tickets/ticket-container.css";

function TicketContainer() {
  const [filters, setFilters] = useState({});

  // Function to update filters from Filter component
  const handleSearchChange = (updatedFilters) => {
    setFilters(updatedFilters);
    console.log("Updated Filters:", updatedFilters);
  };

  return (
    <div className="Container">
      <div className="Second-Container">
        <div className="ticketLeft">
          <Heading />
          <Filter onSearchChange={handleSearchChange} />
          <TicketLeft filters={filters} />
        </div>
      </div>
    </div>
  );
}

export default TicketContainer;
