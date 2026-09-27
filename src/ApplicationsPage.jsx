import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000/api";

const STATUSES = [
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Offered",
  "Placed",
  "Rejected",
];

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const [formData, setFormData] = useState({
    StudentID: "",
    InternshipID: "",
    Status: "Applied",
    Notes: "",
  });

  const loadData = async () => {
    try {
      const [
        applicationsResponse,
        studentsResponse,
        internshipsResponse,
      ] = await Promise.all([
        fetch(`${API}/applications`),
        fetch(`${API}/students`),
        fetch(`${API}/internships`),
      ]);

      const [
        applicationsData,
        studentsData,
        internshipsData,
      ] = await Promise.all([
        applicationsResponse.json(),
        studentsResponse.json(),
        internshipsResponse.json(),
      ]);

      setApplications(applicationsData);
      setStudents(studentsData);
      setInternships(internshipsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading application data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      StudentID: "",
      InternshipID: "",
      Status: "Applied",
      Notes: "",
    });

    setEditingApplication(null);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleNewApplication = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (application) => {
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/applications/${applicationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete application.");
        return;
      }

      loadData();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Could not connect to the server.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let url;
      let method;
      let payload;

      if (editingApplication) {
        url = `${API}/applications/${editingApplication.ApplicationID}`;
        method = "PUT";

        payload = {
          Status: formData.Status,
          Notes: formData.Notes,
        };
      } else {
        url = `${API}/applications`;
        method = "POST";

        payload = {
          StudentID: Number(formData.StudentID),
          InternshipID: Number(formData.InternshipID),
        };
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Operation failed.");
        return;
      }

      resetForm();
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("Error saving application:", error);
      alert("Could not connect to the server.");
    }
  };

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>
            Manage internship applications and their status.
          </p>
        </div>

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
      </div>

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
                    value={editingApplication.StudentName}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Internship</label>
                  <input
                    type="text"
                    value={editingApplication.InternshipTitle}
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
                        className={`status-badge status-${application.Status.toLowerCase()}`}
                      >
                        {application.Status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(application)
                        }
                      >
                        Edit
                      </button>

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