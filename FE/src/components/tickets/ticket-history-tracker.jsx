import "../../style/tickets/ticket-history-tracker.css";
import TimeOne from "../../assets/time-1-icon.png";
import TimeSec from "../../assets/time-2-icon.png";
import TimeThree from "../../assets/time-3-icon.png";
import TimeFour from "../../assets/time-4-icon.png";
import TimeFive from "../../assets/time-5-icon.png";

const TicketHistory = ({ ticketDetails }) => {
  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    let hours = date.getHours();
    const mins = date.getMinutes().toString().padStart(2, "0");
    const secs = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const hh = hours.toString().padStart(2, "0");

    return `${day} ${month} ${year} | ${hh}:${mins}:${secs} ${ampm}`;
  };

  const historyData = [
    {
      icon: <img src={TimeOne} alt="Time icon" className="timer-icon" />,
      title: "Ticket Created",
      datetime: formatDateTime(ticketDetails.created_at),
    },
    {
      icon: <img src={TimeSec} alt="Time icon" className="timer-icon" />,
      title: "Ticket Assigned by Technician",
      datetime: formatDateTime(ticketDetails.updated_at),
    },
    {
      icon: <img src={TimeThree} alt="Time icon" className="timer-icon" />,
      title: "Technician Acknowladge the Ticket",
      datetime: formatDateTime(ticketDetails.updated_at),
    },
    {
      icon: <img src={TimeFour} alt="Time icon" className="timer-icon" />,
      title: "Technician Completed",
      datetime: formatDateTime(ticketDetails.updated_at),
    },
    {
      icon: <img src={TimeFive} alt="Time icon" className="timer-icon" />,
      title: "User Accepted",
      datetime: formatDateTime(ticketDetails.updated_at),
    },
  ];

  return (
    <div className="ticket-history">
      <h3>Ticket Log</h3>
      <div className="timeline">
        {historyData.map((item, index) => (
          <div className="timeline-item" key={index}>
            <div className="timeline-icon">{item.icon}</div>
            <div className="timeline-content">
              <h4>{item.title}</h4>
              <p>{item.datetime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketHistory;
