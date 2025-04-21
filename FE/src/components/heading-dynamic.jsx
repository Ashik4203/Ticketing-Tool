import React from "react";
import "../../src/style/heading.css";

const Heading = ({ title }) => {
  return (
    <div className="top-heading">
      <h3 className="top-text">{title}</h3>
    </div>
  );
};

export default Heading;
