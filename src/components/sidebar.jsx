import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OverView from "../assets/Dashboard-icon.png";
import Ticket from "../assets/Ticket-icon.png";
import Report from "../assets/Report-icon.png";
import Addticket from "../assets/Add new ticket.png";
import Assignticket from "../assets/Assign ticket.png";
import "../style/sidebar.css";

const getIcon = (iconName) => {
  const icons = {
    OverView: OverView,
    Ticket: Ticket,
    Report: Report,
    Addticket: Addticket,
    Assignticket: Assignticket,
  };
  return icons[iconName] || OverView;
};


const Sidebar = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);

  const staticOptions = [
    {
      name: "Dashboard",
      route: "/dashboard",
      icon: "OverView",
      slug: "view_dashboard",
    },

    {
      name: "Add New Ticket",
      route: "/ticket/createticket",
      icon: "Addticket",
      slug: "add_ticket",
    },
    {
      name: "My Tickets",
      route: "/tickets",
      icon: "Ticket",
      slug: "view_ticket",
    },
    {
      name: "Assigned Tickets",
      route: "/tickets?assigned=yes",
      icon: "Assignticket",
      slug: "view_assigned_ticket",
    },
    {
      name: "Reports",
      route: "/report",
      icon: "Report",
      slug: "view_report",
    },
  ];

  const handleNavigate = (route) => {
    navigate(route, { replace: true });
  };

  const hasViewPermission = (slug) => {
    return permissions.some((perm) => perm.slug === slug);
  };

  useEffect(() => {
    // Load permissions from localStorage
    const stored = localStorage.getItem("permissions");
    if (stored) {
      try {
        setPermissions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse permissions from localStorage", e);
      }
    }
  }, []);

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <div className="static-menu">
          {permissions.length === 0 ? (
            <p className="loading">Loading...</p>
          ) : (
            staticOptions.map((option, index) => {
              if (hasViewPermission(option.slug)) {
                return (
                  <button
                    key={`static-${index}`}
                    className="nav-item main-menu"
                    onClick={() => handleNavigate(option.route)}
                  >
                    <img
                      src={getIcon(option.icon)}
                      alt={option.name}
                      className="icon"
                    />
                    <span>{option.name}</span>
                  </button>
                );
              }
              return null;
            })
          )}
        </div>
      </nav>
      <img
        src="/Background-img.png"
        alt="Background-img"
        className="background-img"
      />
    </aside>
  );
};

export default Sidebar;
