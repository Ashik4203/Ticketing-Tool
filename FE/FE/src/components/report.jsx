import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import excleIcon from "../assets/excel.png";
import "../style/report.css";

export const Report = () => {
  // Initialize as empty array instead of an empty string
  const [ticketDetails, setTicketDetails] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetch ticket details from the API
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(
          "https://mocki.io/v1/fb4d2454-e975-4c28-9224-c3fbac12ae52"
        );
        // Make sure response.data is an array before setting it
        if (Array.isArray(response.data)) {
          setTicketDetails(response.data); // Update state with fetched data
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Handle Filtering
  const handleFilter = () => {
    let filtered = ticketDetails; // Changed from fetchTicketDetails to ticketDetails

    if (selectedProject) {
      filtered = filtered.filter((row) => row.module === selectedProject);
    }

    if (selectedStatus) {
      filtered = filtered.filter((row) => row.status === selectedStatus);
    }

    if (startDate && endDate) {
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.date.split("/").reverse().join("-"));
        return rowDate >= startDate && rowDate <= endDate;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    const uniqueData = [
      ...new Map(ticketDetails.map((item) => [item.id, item])).values(),
    ];
    setFilteredData(uniqueData);
  }, [ticketDetails]); // Added ticketDetails as dependency

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Clear filters
  const handleClear = () => {
    setSelectedProject("");
    setSelectedStatus("");
    setDateRange([null, null]);
    setFilteredData(ticketDetails); // Reset filtered data
  };

  const exportToExcel = () => {
    //define table header
    const headers = [
      [
        "Sl No",
        "Date",
        "Ticket Number",
        "Project Module",
        "Ticket Created By",
        "Ticket Closed By",
        "Status",
      ],
    ];
    const data = filteredData.map((row, index) => [
      index + 1,
      row.date,
      row.ticket,
      row.module,
      row.createdBy,
      row.closedBy,
      row.status,
    ]);
    //combine header and data
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    //create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    //Generate the excel file and trigger the download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Report.xlsx");
  };

  return (
    <div className="report">
      <h2 className="report-heading">Report</h2>

      {/* Filters */}
      <div className="report-filters">
        <select
          className="report-dropdown"
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
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            className="report-datepicker"
            placeholderText="Select Date Range"
            onClickOutside={() => setIsOpen(false)}
            open={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />
          <FaCalendarAlt
            className="calendar-icon"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        <select
          className="report-dropdown"
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
              <th>Date</th>
              <th>Ticket Number</th>
              <th>Project Module</th>
              <th>Ticket Created By</th>
              <th>Ticket Closed By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr key={row.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{row.date}</td>
                  <td>{row.ticket}</td>
                  <td>{row.module}</td>
                  <td>{row.createdBy}</td>
                  <td>{row.closedBy}</td>
                  <td>{row.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-report">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {" "}
          <h4 className="pagination-h4">Prev</h4>
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
            <h4 className="pagination-h4">Next</h4>
            </button>
      </div>
    </div>
  );
};

export default Report;
