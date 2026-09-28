import React, { useEffect, useState } from "react";
import { apiFetch } from "./api";

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAuditLog();
  }, []);

  const loadAuditLog = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/audit-log");
      setLogs(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load audit log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Audit Log</h1>
          <p>
            History of changes made to internship applications
          </p>
        </div>
      </div>

      {loading && (
        <div className="empty-state">
          Loading audit log...
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
                  <th>Audit ID</th>
                  <th>Application ID</th>
                  <th>Old Status</th>
                  <th>New Status</th>
                  <th>Change Date</th>
                  <th>Changed By</th>
                </tr>
              </thead>

              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      No audit records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.AuditID}>
                      <td>{log.AuditID}</td>

                      <td>
                        {log.ApplicationID}
                      </td>

                      <td>
                        <span className="status-badge">
                          {log.OldStatus || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="status-badge">
                          {log.NewStatus || "-"}
                        </span>
                      </td>

                      <td>
                        {log.ChangeDate
                          ? new Date(
                              log.ChangeDate
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        {log.ChangedBy || "-"}
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

export default AuditLogPage;