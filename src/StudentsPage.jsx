import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "./api";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("interhub_user")) || null;
  } catch {
    return null;
  }
};
function StudentsPage() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Major: "",
    Phone: "",
  });

  const resetForm = () => {
    setFormData({
      Name: "",
      Email: "",
      Major: "",
      Phone: "",
    });

    setEditingStudent(null);
  };

  const loadStudents = async () => {
    try {
      const data = await apiFetch("/students");

      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading students:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Open Add Student form from Dashboard Quick Links
  useEffect(() => {
    if (searchParams.get("action") === "add") {
      resetForm();
      setShowForm(true);

      // Remove ?action=add from the URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);

    setFormData({
      Name: student.Name,
      Email: student.Email,
      Major: student.Major || "",
      Phone: student.Phone || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(`/students/${studentId}`, {
        method: "DELETE",
      });

      loadStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert(error.message || "Could not delete student.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const endpoint = editingStudent
        ? `/students/${editingStudent.StudentID}`
        : "/students";

      const method = editingStudent ? "PUT" : "POST";

      await apiFetch(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      resetForm();
      setShowForm(false);

      loadStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      alert(error.message || "Operation failed.");
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
    <h1>Students</h1>
    <p>Manage students registered in the internship system.</p>
  </div>

  {isAdmin && (
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
      {showForm ? "Cancel" : "+ Add Student"}
    </button>
  )}
</div>

      {showForm && (
        <section className="card form-card">
          <div className="card-header">
            <h2>
              {editingStudent ? "Edit Student" : "Add Student"}
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
                <label>Major</label>

                <input
                  type="text"
                  name="Major"
                  value={formData.Major}
                  onChange={handleChange}
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
                {editingStudent
                  ? "Update Student"
                  : "Save Student"}
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
          <h2>Student List</h2>

          <span className="count">
            {students.length} Students
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading students...
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Major</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.StudentID}>
                    <td>{student.StudentID}</td>

                    <td className="student-name">
                      {student.Name}
                    </td>

                    <td>{student.Email}</td>

                    <td>{student.Major}</td>

                    <td>{student.Phone}</td>

                    <td>
  {isAdmin && (
    <>
      <button
        className="edit-button"
        onClick={() => handleEdit(student)}
      >
        Edit
      </button>

      <button
        className="delete-button"
        onClick={() =>
          handleDelete(student.StudentID)
        }
      >
        Delete
      </button>
    </>
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

export default StudentsPage;