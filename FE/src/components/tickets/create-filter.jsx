import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/tickets/create-filter.css";
import { apiService, PORTS } from "../../services/apiService";
import ExcelIcon from "../../assets/excel-3.png";

const Filter = ({ onSearchChange }) => {
  const [formValues, setFormValues] = useState({});
  const [projects, setProjects] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await apiService.get("api/tickets/ticket/status");
        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await apiService.get("api/projects");
        if (response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchStatuses();
    fetchProjects();
  }, []);

  const handleChange = (e, id, isMultiSelect = false) => {
    const value = isMultiSelect
      ? Array.from(e.target.selectedOptions, (option) => option.value)
      : e.target.value;

    const updatedValues = { ...formValues, [id]: value };
    setFormValues(updatedValues);
    onSearchChange(updatedValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(formValues);
  };

  const handleExportFiltered = async () => {
    setShowExportPopup(false);
    try {
      const params = new URLSearchParams(formValues).toString();
      const res = await apiService.get(`api/tickets/ticket/export?${params}`);
      if (res && res.downloadLink) {
        const a = document.createElement("a");
        a.href = res.downloadLink;
        a.download = "tickets.xlsx";
        a.click();
      }
    } catch (err) {
      console.error("Error exporting filtered data", err);
    }
  };

  const handleExportAll = async () => {
    setShowExportPopup(false);
    try {
      const res = await apiService.get("api/tickets/ticket/export?export=all");
      if (res && res.downloadLink) {
        const a = document.createElement("a");
        a.href = res.downloadLink;
        a.download = "tickets.xlsx";
        a.click();
      }
    } catch (err) {
      console.error("Error exporting all data", err);
    }
  };

  const handleResetFilters = () => {
    const reset = {
      search: "",
      project_id: "",
      module: "",
      category: "",
      source: "",
      priority: "",
      status_id: "",
    };
    setFormValues(reset);
    onSearchChange(reset);
  };

  return (
    <div className="filter-container">
      <form className="filter-form" onSubmit={handleSubmit}>
        <div className="filter-row">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              placeholder="search..."
              value={formValues.search || ""}
              onChange={(e) => handleChange(e, "search")}
            />
          </div>
          <div className="filter-group">
            <select
              value={formValues.project_id || ""}
              onChange={(e) => handleChange(e, "project_id")}
              className="filter-select"
            >
              <option value="">Select Project</option>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))
              ) : (
                <option value="">No projects available</option>
              )}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={formValues.status_id || ""}
              onChange={(e) => handleChange(e, "status_id")}
              className="filter-select"
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.status}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-btn-group">
            <button
              type="button"
              className="reset-button"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>

          <div className="filter-btn-group">
            {/* Search Buttons */}
            <div className="filter-btn-group">
              <div>
                <button
                  type="button"
                  className="export-filter-button"
                  onClick={handleExportFiltered}
                >
                  <img src={ExcelIcon} alt="ExcelIcon" width="25" height="25" />
                </button>
              </div>
              <div className="export-filter-button-name">
                {" "}
                <p onClick={handleExportFiltered}>Export Data</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filter;
