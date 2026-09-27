import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000/api";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Major: "",
    Phone: "",
  });

  const loadStudents = () => {
    fetch(`${API}/students`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading students:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStudents();
  }, []);

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
    const response = await fetch(
      `${API}/students/${studentId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to delete student.");
      return;
    }

    loadStudents();
  } catch (error) {
    console.error("Error deleting student:", error);
    alert("Could not connect to the server.");
  }
};

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const url = editingStudent
      ? `${API}/students/${editingStudent.StudentID}`
      : `${API}/students`;

    const method = editingStudent ? "PUT" : "POST";

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

    setFormData({
      Name: "",
      Email: "",
      Major: "",
      Phone: "",
    });

    setEditingStudent(null);
    setShowForm(false);

    loadStudents();
  } catch (error) {
    console.error("Error saving student:", error);
    alert("Could not connect to the server.");
  }
};

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage students registered in the internship system.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Student"}
        </button>
      </div>

      {showForm && (
        <section className="card form-card">
          <div className="card-header">
            <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
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
              <button type="submit" className="primary-button">
                {editingStudent ? "Update Student" : "Save Student"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
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
          <div className="loading">Loading students...</div>
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
                      <button
  className="edit-button"
  onClick={() => handleEdit(student)}
>
  Edit
</button>

                      <button
  className="delete-button"
  onClick={() => handleDelete(student.StudentID)}
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

export default StudentsPage;