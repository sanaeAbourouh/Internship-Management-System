import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "./api";

const STATUSES = [
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Offered",
  "Placed",
  "Rejected",
];

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("interhub_user")) || null;
  } catch {
    return null;
  }
};

function ApplicationsPage() {
  const currentUser = getCurrentUser();

  const isAdmin = currentUser?.role === "admin";
  const isStudent = currentUser?.role === "student";
  const isCompany = currentUser?.role === "company";

  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    StudentID: "",
    InternshipID: "",
    Status: "Applied",
    Notes: "",
  });

  const resetForm = () => {
    setFormData({
      StudentID: "",
      InternshipID: "",
      Status: "Applied",
      Notes: "",
    });

    setEditingApplication(null);
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const applicationsData = await apiFetch("/applications");
      const internshipsData = await apiFetch("/internships");

      setApplications(applicationsData);
      setInternships(internshipsData);

      // Students are only needed when Admin or Student
      // creates a new application.
      if (isAdmin || isStudent) {
        const studentsData = await apiFetch("/students");
        setStudents(studentsData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading application data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open New Application form from Dashboard Quick Links
  useEffect(() => {
    const action = searchParams.get("action");

    if (action === "add" && (isAdmin || isStudent)) {
      resetForm();
      setShowForm(true);

      // Remove ?action=add from URL
      setSearchParams({}, { replace: true });
    } else if (action === "add") {
      // Company is not allowed to create applications.
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, isAdmin, isStudent]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewApplication = () => {
    if (!isAdmin && !isStudent) {
      return;
    }

    resetForm();
    setShowForm(true);
  };

  const handleEdit = (application) => {
    if (!isAdmin && !isCompany) {
      return;
    }

    setEditingApplication(application);

    setFormData({
      StudentID: application.StudentID || "",
      InternshipID: application.InternshipID || "",
      Status: application.Status || "Applied",
      Notes: "",
    });

    setShowForm(true);
  };

  const handleDelete = async (applicationId) => {
    if (!isAdmin) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(`/applications/${applicationId}`, {
        method: "DELETE",
      });

      loadData();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert(error.message || "Could not delete application.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let endpoint;
      let method;
      let payload;

      if (editingApplication) {
        // Only Admin and Company can edit.
        if (!isAdmin && !isCompany) {
          return;
        }

        endpoint = `/applications/${editingApplication.ApplicationID}`;
        method = "PUT";

        payload = {
          Status: formData.Status,
          Notes: formData.Notes,
        };
      } else {
        // Only Admin and Student can create.
        if (!isAdmin && !isStudent) {
          return;
        }

        endpoint = "/applications";
        method = "POST";

        payload = {
          StudentID: Number(formData.StudentID),
          InternshipID: Number(formData.InternshipID),
        };
      }

      await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      resetForm();
      setShowForm(false);

      loadData();
    } catch (error) {
      console.error("Error saving application:", error);
      alert(error.message || "Operation failed.");
    }
  };

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <main className="main-content">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>
            Manage internship applications and their status.
          </p>
        </div>

        {(isAdmin || isStudent) && (
          <button
            className="primary-button"
            onClick={() => {
              if (showForm) {
                cancelForm();
              } else {
                handleNewApplication();
              }
            }}
          >
            {showForm ? "Cancel" : "+ New Application"}
          </button>
        )}
      </div>

      {/* =========================
          ADD / EDIT FORM
      ========================== */}
      {showForm && (
        <section className="card form-card">
          <div className="card-header">
            <h2>
              {editingApplication
                ? "Edit Application"
                : "New Application"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            {!editingApplication ? (
              <div className="form-grid">
                <div className="form-group">
                  <label>Student *</label>

                  <select
                    name="StudentID"
                    value={formData.StudentID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select a student
                    </option>

                    {students.map((student) => (
                      <option
                        key={student.StudentID}
                        value={student.StudentID}
                      >
                        {student.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Internship *</label>

                  <select
                    name="InternshipID"
                    value={formData.InternshipID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select an internship
                    </option>

                    {internships.map((internship) => (
                      <option
                        key={internship.InternshipID}
                        value={internship.InternshipID}
                      >
                        {internship.Title} —{" "}
                        {internship.CompanyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="form-grid">
                <div className="form-group">
                  <label>Student</label>

                  <input
                    type="text"
                    value={editingApplication.StudentName || ""}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Internship</label>

                  <input
                    type="text"
                    value={
                      editingApplication.InternshipTitle || ""
                    }
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>

                  <select
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                    required
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes</label>

                  <textarea
                    name="Notes"
                    value={formData.Notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Optional note about the status change"
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
              >
                {editingApplication
                  ? "Update Application"
                  : "Submit Application"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =========================
          APPLICATION TABLE
      ========================== */}
      <section className="card">
        <div className="card-header">
          <h2>Application List</h2>

          <span className="count">
            {applications.length} Applications
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading applications...
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.ApplicationID}>
                    <td>{application.ApplicationID}</td>

                    <td className="student-name">
                      {application.StudentName}
                    </td>

                    <td>{application.CompanyName}</td>

                    <td>{application.InternshipTitle}</td>

                    <td>{application.SupervisorName}</td>

                    <td>{application.Duration}</td>

                    <td>{application.Salary}</td>

                    <td>{application.Location}</td>

                    <td>{application.ApplicationDate}</td>

                    <td>
                      <span
                        className={`status-badge status-${String(
                          application.Status || ""
                        ).toLowerCase()}`}
                      >
                        {application.Status}
                      </span>
                    </td>

                    <td>
                      {/* Admin + Company can edit */}
                      {(isAdmin || isCompany) && (
                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(application)
                          }
                        >
                          Edit
                        </button>
                      )}

                      {/* Only Admin can delete */}
                      {isAdmin && (
                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(
                              application.ApplicationID
                            )
                          }
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default ApplicationsPage;