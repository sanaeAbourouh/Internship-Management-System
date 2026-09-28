import React, { useEffect, useState } from "react";
import { apiFetch } from "./api";

function ApplicationDetailsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplicationDetails();
  }, []);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/application-details");
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load application details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Application Details</h1>
          <p>
            Detailed information about internship applications
          </p>
        </div>
      </div>

      {loading && (
        <div className="empty-state">
          Loading application details...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Internship</th>
                  <th>Supervisor</th>
                  <th>Duration</th>
                  <th>Salary</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-table">
                      No application details found.
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application.ApplicationID}>
                      <td>{application.ApplicationID}</td>

                      <td>
                        <strong>{application.StudentName}</strong>
                        <small>
                          {application.StudentEmail}
                        </small>
                      </td>

                      <td>{application.CompanyName}</td>

                      <td>
                        {application.InternshipTitle}
                      </td>

                      <td>
                        <strong>
                          {application.SupervisorName}
                        </strong>
                        <small>
                          {application.SupervisorEmail}
                        </small>
                      </td>

                      <td>{application.Duration}</td>

                      <td>{application.Salary}</td>

                      <td>{application.Location}</td>

                      <td>
                        {application.ApplicationDate
                          ? new Date(
                              application.ApplicationDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${String(
                            application.Status || ""
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {application.Status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationDetailsPage;