import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import excleIcon from "../assets/excel.png";
import "../style/report.css";

const Report = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;

  const [startDate, endDate] = dateRange;

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

  // if (loading) {
  //   return <p>Loading ticket details...</p>;
  // }

  // Filter logic
  const handleFilter = () => {
    let result = [...ticketDetails];

    if (selectedProject) {
      result = result.filter((row) => row.module === selectedProject);
    }
    if (selectedStatus) {
      result = result.filter((row) => row.status === selectedStatus);
    }
    if (startDate && endDate) {
      result = result.filter((row) => {
        const rowDate = new Date(row.date.split("/").reverse().join("-"));
        return rowDate >= startDate && rowDate <= endDate;
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectedProject("");
    setSelectedStatus("");
    setDateRange([null, null]);
    setFilteredData(ticketDetails);
  };

  const exportToExcel = () => {
    const headers = [
      [
        "Sl No",
        "Ticket Id",
        "Module",
        "Subject",
        "Category",
        "Source",
        "Due date",
        "Behalf of",
        "Problem description",
        "Priority",
        "Ticket Created By",
        "Ticket Closed By",
        "Status",
      ],
    ];
    const rows = filteredData.map((row, index) => [
      index + 1,
      row.Ticket_Id,
      row.Module,
      row.Subject,
      row.Category,
      row.Source,
      row.Due_date,
      row.Behalf_of,
      row.Problem_description,
      row.Priority,
      row.createdBy,
      row.closedBy,
      row.status,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Report.xlsx");
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="report">
      <h2 className="report-heading">Report</h2>

      {/* Filters */}
      <div className="report-filters">
        <select
          className="report-dropdown"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          <option value="Customer App">Customer App</option>
          <option value="Focuz ERP">Focuz ERP</option>
          <option value="Zoho Analytics">Zoho Analytics</option>
          <option value="Sales Executive App">Sales Executive App</option>
          <option value="MDM">MDM</option>
        </select>

        <div className="datepicker-container">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            className="report-datepicker"
            placeholderText="Select Date Range"
            open={isOpen}
            onClickOutside={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
          />
          <FaCalendarAlt
            className="calendar-icon"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        <select
          className="report-dropdown"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Hold">Hold</option>
          <option value="Closed">Closed</option>
        </select>

        <button className="report-button" onClick={handleFilter}>
          <h4 className="button-name">Submit</h4>
        </button>
        <button className="clear-button" onClick={handleClear}>
          <h4 className="button-name">Clear</h4>
        </button>
        <button className="export-button" onClick={exportToExcel}>
          <img className="export-excel" src={excleIcon} alt="excel" />
          <h4 className="export-name">Export</h4>
        </button>
      </div>

      {/* Table */}
      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Ticket Id</th>
              <th>Module</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Source</th>
              <th>Due date</th>
              <th>Behalf of</th>
              <th>Problem description</th>
              <th>Priority</th>
              <th>Created By</th>
              <th>Closed By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr key={row.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{row.Ticket_Id}</td>
                  <td>{row.module}</td>
                  <td>{row.Subject}</td>
                  <td>{row.Category}</td>
                  <td>{row.Source}</td>
                  <td>{row.Due_date}</td>
                  <td>{row.Behalf_of}</td>
                  <td>{row.Problem_description}</td>
                  <td>{row.Priority}</td>
                  <td>{row.createdBy}</td>
                  <td>{row.closedBy}</td>
                  <td>{row.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="no-data">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-report">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          <h4 className="pagination-h4">Prev</h4>
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          <h4 className="pagination-h4">Next</h4>
        </button>
      </div>
    </div>
  );
};

export default Report;
