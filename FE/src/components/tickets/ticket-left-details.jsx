// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../style/tickets/ticket-left.css"; // Create a separate CSS file for Ticket if needed

// const TicketLeftDetails = ({ ticketNo, title, description, status }) => {
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const navigate = useNavigate();

//   const handleCloseClick = (e) => {
//     e.preventDefault(); // Prevent form submission refresh
//     navigate("/ticket/createticket/CloseTicket"); // Navigate to the create ticket page
//   };

//   const handleViewClick = (e) => {
//     e.preventDefault(); // Prevent form submission refresh
//     navigate("/ticket/createticket/viewTicket"); // Navigate to the create ticket page
//   };
//   return (
//     <div className="Ticket">
//       <div className="TicketDetails">
//         <div className="Top-Text">
//           <div className="Ticket-No-Bg">
//             <span className="Ticket-No">#{ticketNo}</span>
//           </div>
//           <span>Status: {status}</span>
//         </div>
//         <h3 className="TicketName">{title}</h3>
//         <p className="Description">{description}</p>
//         <div className="btn">
//           <button className="btn-close" onClick={handleCloseClick}>
//             Close
//           </button>
//           <button className="btn-view" onClick={handleViewClick}>
//             View
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TicketLeftDetails;
