import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiService } from "../../services/apiService";
import "../../style/tickets/ticket-create.css";

const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  background: "rgba(30,30,60,0.95)",
  color: "#fff",
  customClass: {
    popup: "toast-modern",
    title: "toast-modern__title",
    icon: "toast-modern__icon",
  },
});

const Create = () => {
  const [projects, setProjects] = useState([]);
  const [formValues, setFormValues] = useState({
    project_id: "",
    module: "",
    subject: "",
    category: "",
    source: "",
    due_date: "",
    behalf_of: "",
    attachment: null,
    problem_description: "",
    priority_status: "",
  });

  const navigate = useNavigate();
  const datepickerRef = useRef(null);

  const staticFormData = {
    modules: ["Module A", "Module B", "Module C"],
    categories: ["Category 1", "Category 2", "Category 3"],
    sources: ["Email", "Phone", "Web"],
    priorityStatuses: ["Low", "Medium", "High"],
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.get("api/projects");
        if (response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        Toast.fire({
          icon: "error",
          title: "Failed to load projects.",
        });
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setFormValues((prev) => ({
        ...prev,
        attachment: files[0] || null,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormValues((prev) => ({
      ...prev,
      due_date: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in formValues) {
      formData.append(key, formValues[key]);
    }

    try {
      const response = await apiService.post("/api/tickets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.ticketId) {
        Toast.fire({
          icon: "success",
          title: "Ticket created successfully!",
        });
        setTimeout(() => navigate("/ticket"), 1000);
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to create ticket.",
        });
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      Toast.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="form-container-create">
      <form className="ticket-form" onSubmit={handleSubmit}>
        <div className="ticket-formdiv">
          <h2 className="ticket-formh2">Create Ticket</h2>
        </div>
        <div className="ticket-cont-Details">
          {/* Project and Module Section */}
          <div className="row">
            <div className="form-group-ticket">
              <label className="form-label">
                Project <span className="form-lable-require">*</span>
              </label>
              <select
                name="project_id"
                value={formValues.project_id}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-ticket-r">
              <label className="form-label">
                Module <span className="form-lable-require">*</span>
              </label>
              <select
                name="module"
                value={formValues.module}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Module</option>
                {staticFormData.modules.map((module, index) => (
                  <option key={index} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source and Due Date Section */}
          <div className="row">
            <div className="form-group-ticket">
              <label className="form-label">
                Source <span className="form-lable-require">*</span>
              </label>
              <select
                name="source"
                value={formValues.source}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Source</option>
                {staticFormData.sources.map((source, index) => (
                  <option key={index} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-ticket-r">
              <label className="form-label">
                Due Date <span className="form-lable-require">*</span>
              </label>

              <div className="form-date-picker-wrapper">
                <DatePicker
                  selected={formValues.due_date}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Due Date"
                  className="form-date-picker"
                  required
                  ref={datepickerRef}
                />
                <FaCalendarAlt
                  className="datepicker-icon"
                  onClick={() => datepickerRef.current.setFocus()}
                />
              </div>
            </div>
          </div>

          {/* Behalf Of and Attachment Section */}
          <div className="row">
            <div className="form-group-ticket">
              <label className="form-label">Behalf Of</label>
              <input
                type="text"
                name="behalf_of"
                value={formValues.behalf_of}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group-ticket-r">
              <label className="form-label">Attachment</label>
              <input
                type="file"
                name="attachment"
                onChange={handleChange}
                className="form-file-input"
              />
            </div>
          </div>

          {/* Category and Priority Status Section */}
          <div className="row">
            <div className="form-group-ticket">
              <label className="form-label">
                Category <span className="form-lable-require">*</span>
              </label>
              <select
                name="category"
                value={formValues.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Category</option>
                {staticFormData.categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-ticket-r">
              <label className="form-label">
                Priority Status <span className="form-lable-require">*</span>
              </label>
              <select
                name="priority_status"
                value={formValues.priority_status}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Priority</option>
                {staticFormData.priorityStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Subject and Problem Description Section */}
          <div className="row">
            <div className="form-group-ticket">
              <label className="form-label">
                Subject <span className="form-lable-require">*</span>
              </label>
              <textarea
                name="subject"
                value={formValues.subject}
                onChange={handleChange}
                className="form-textarea"
                required
              ></textarea>
            </div>

            <div className="form-group-ticket-r">
              <label className="form-label">Problem Description</label>
              <textarea
                name="problem_description"
                value={formValues.problem_description}
                onChange={handleChange}
                className="form-textarea"
              ></textarea>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/ticket")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create;
