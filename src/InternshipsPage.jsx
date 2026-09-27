import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000/api";

function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);

  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Duration: "",
    Salary: "",
    Location: "",
    CompanyID: "",
    SupervisorID: "",
  });

  const loadData = async () => {
    try {
      const [internshipsResponse, companiesResponse, supervisorsResponse] =
        await Promise.all([
          fetch(`${API}/internships`),
          fetch(`${API}/companies`),
          fetch(`${API}/supervisors`),
        ]);

      const [internshipsData, companiesData, supervisorsData] =
        await Promise.all([
          internshipsResponse.json(),
          companiesResponse.json(),
          supervisorsResponse.json(),
        ]);

      setInternships(internshipsData);
      setCompanies(companiesData);
      setSupervisors(supervisorsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading internship data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      Title: "",
      Description: "",
      Duration: "",
      Salary: "",
      Location: "",
      CompanyID: "",
      SupervisorID: "",
    });

    setEditingInternship(null);
  };

  const handleEdit = (internship) => {
    setEditingInternship(internship);

    setFormData({
      Title: internship.Title || "",
      Description: internship.Description || "",
      Duration: internship.Duration || "",
      Salary: internship.Salary || "",
      Location: internship.Location || "",
      CompanyID: internship.CompanyID || "",
      SupervisorID: internship.SupervisorID || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (internshipId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this internship?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/internships/${internshipId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete internship.");
        return;
      }

      loadData();
    } catch (error) {
      console.error("Error deleting internship:", error);
      alert("Could not connect to the server.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = editingInternship
        ? `${API}/internships/${editingInternship.InternshipID}`
        : `${API}/internships`;

      const method = editingInternship ? "PUT" : "POST";

      const payload = {
        ...formData,
        CompanyID: Number(formData.CompanyID),
        SupervisorID: Number(formData.SupervisorID),
      };

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
      console.error("Error saving internship:", error);
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
          <h1>Internships</h1>
          <p>Manage available internship opportunities.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              cancelForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Internship"}
        </button>
      </div>

      {showForm && (
        <section className="card form-card">
          <div className="card-header">
            <h2>
              {editingInternship
                ? "Edit Internship"
                : "Add Internship"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-grid">

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="Duration"
                  value={formData.Duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 months"
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="text"
                  name="Salary"
                  value={formData.Salary}
                  onChange={handleChange}
                  placeholder="e.g. 5000 RMB"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="Location"
                  value={formData.Location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Company *</label>
                <select
                  name="CompanyID"
                  value={formData.CompanyID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a company</option>

                  {companies.map((company) => (
                    <option
                      key={company.CompanyID}
                      value={company.CompanyID}
                    >
                      {company.CompanyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Supervisor *</label>
                <select
                  name="SupervisorID"
                  value={formData.SupervisorID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a supervisor</option>

                  {supervisors.map((supervisor) => (
                    <option
                      key={supervisor.SupervisorID}
                      value={supervisor.SupervisorID}
                    >
                      {supervisor.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-full-width">
                <label>Description</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingInternship
                  ? "Update Internship"
                  : "Save Internship"}
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
          <h2>Internship List</h2>

          <span className="count">
            {internships.length} Internships
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading internships...
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Supervisor</th>
                  <th>Duration</th>
                  <th>Salary</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {internships.map((internship) => (
                  <tr key={internship.InternshipID}>
                    <td>{internship.InternshipID}</td>

                    <td className="student-name">
                      {internship.Title}
                    </td>

                    <td>{internship.CompanyName}</td>

                    <td>{internship.SupervisorName}</td>

                    <td>{internship.Duration}</td>

                    <td>{internship.Salary}</td>

                    <td>{internship.Location}</td>

                    <td>
                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(internship)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            internship.InternshipID
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

export default InternshipsPage;