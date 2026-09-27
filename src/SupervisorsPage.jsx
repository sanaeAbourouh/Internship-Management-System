import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000/api";

function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
  });

  const loadSupervisors = () => {
    fetch(`${API}/supervisors`)
      .then((response) => response.json())
      .then((data) => {
        setSupervisors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading supervisors:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSupervisors();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      Name: "",
      Email: "",
      Phone: "",
    });

    setEditingSupervisor(null);
  };

  const handleEdit = (supervisor) => {
    setEditingSupervisor(supervisor);

    setFormData({
      Name: supervisor.Name,
      Email: supervisor.Email,
      Phone: supervisor.Phone || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (supervisorId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supervisor?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/supervisors/${supervisorId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete supervisor.");
        return;
      }

      loadSupervisors();
    } catch (error) {
      console.error("Error deleting supervisor:", error);
      alert("Could not connect to the server.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = editingSupervisor
        ? `${API}/supervisors/${editingSupervisor.SupervisorID}`
        : `${API}/supervisors`;

      const method = editingSupervisor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Operation failed.");
        return;
      }

      resetForm();
      setShowForm(false);
      loadSupervisors();
    } catch (error) {
      console.error("Error saving supervisor:", error);
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
          <h1>Supervisors</h1>
          <p>Manage internship supervisors.</p>
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
          {showForm ? "Cancel" : "+ Add Supervisor"}
        </button>
      </div>

      {showForm && (
        <section className="card form-card">
          <div className="card-header">
            <h2>
              {editingSupervisor
                ? "Edit Supervisor"
                : "Add Supervisor"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-grid">

              <div className="form-group">
                <label>Name *</label>

                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>

                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="text"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
              >
                {editingSupervisor
                  ? "Update Supervisor"
                  : "Save Supervisor"}
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
          <h2>Supervisor List</h2>

          <span className="count">
            {supervisors.length} Supervisors
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading supervisors...
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {supervisors.map((supervisor) => (
                  <tr key={supervisor.SupervisorID}>
                    <td>{supervisor.SupervisorID}</td>

                    <td className="student-name">
                      {supervisor.Name}
                    </td>

                    <td>{supervisor.Email}</td>

                    <td>{supervisor.Phone}</td>

                    <td>
                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(supervisor)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            supervisor.SupervisorID
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

export default SupervisorsPage;