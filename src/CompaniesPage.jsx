import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "./api";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    CompanyName: "",
    Email: "",
    Address: "",
    Phone: "",
    Industry: "",
  });

  const resetForm = () => {
    setFormData({
      CompanyName: "",
      Email: "",
      Address: "",
      Phone: "",
      Industry: "",
    });

    setEditingCompany(null);
  };

  const loadCompanies = async () => {
    try {
      const data = await apiFetch("/companies");
      setCompanies(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading companies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // Open Add Company form when coming from Dashboard Quick Links
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

  const handleEdit = (company) => {
    setEditingCompany(company);

    setFormData({
      CompanyName: company.CompanyName,
      Email: company.Email,
      Address: company.Address || "",
      Phone: company.Phone || "",
      Industry: company.Industry || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (companyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/companies/${companyId}`, {
        method: "DELETE",
      });

      loadCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
      alert(error.message || "Could not delete company.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const endpoint = editingCompany
        ? `/companies/${editingCompany.CompanyID}`
        : "/companies";

      const method = editingCompany ? "PUT" : "POST";

      await apiFetch(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      resetForm();
      setShowForm(false);

      loadCompanies();
    } catch (error) {
      console.error("Error saving company:", error);
      alert(error.message || "Operation failed.");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1>Companies</h1>
          <p>Manage companies offering internship opportunities.</p>
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
          {showForm ? "Cancel" : "+ Add Company"}
        </button>
      </div>

      {showForm && (
        <section className="card form-card">
          <div className="card-header">
            <h2>
              {editingCompany ? "Edit Company" : "Add Company"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="CompanyName"
                  value={formData.CompanyName}
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
                <label>Address</label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
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

              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  name="Industry"
                  value={formData.Industry}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingCompany
                  ? "Update Company"
                  : "Save Company"}
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
          <h2>Company List</h2>

          <span className="count">
            {companies.length} Companies
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading companies...
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Industry</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr key={company.CompanyID}>
                    <td>{company.CompanyID}</td>

                    <td className="student-name">
                      {company.CompanyName}
                    </td>

                    <td>{company.Email}</td>

                    <td>{company.Address}</td>

                    <td>{company.Phone}</td>

                    <td>{company.Industry}</td>

                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(company)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(company.CompanyID)
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

export default CompaniesPage;