import { useEffect, useState } from "react";

const API = "http://127.0.0.1:5000/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/students`).then((res) => res.json()),
      fetch(`${API}/companies`).then((res) => res.json()),
      fetch(`${API}/internships`).then((res) => res.json()),
      fetch(`${API}/applications`).then((res) => res.json()),
      fetch(`${API}/supervisors`).then((res) => res.json()),
    ])
      .then(
        ([
          studentsData,
          companiesData,
          internshipsData,
          applicationsData,
          supervisorsData,
        ]) => {
          setStudents(studentsData);
          setCompanies(companiesData);
          setInternships(internshipsData);
          setApplications(applicationsData);
          setSupervisors(supervisorsData);
        }
      )
      .catch((error) => {
        console.error("Dashboard loading error:", error);
      });
  }, []);

  const stats = [
    {
      title: "Students",
      count: students.length,
      icon: "👨‍🎓",
      className: "purple",
    },
    {
      title: "Companies",
      count: companies.length,
      icon: "🏢",
      className: "blue",
    },
    {
      title: "Internships",
      count: internships.length,
      icon: "💼",
      className: "pink",
    },
    {
      title: "Applications",
      count: applications.length,
      icon: "📄",
      className: "orange",
    },
    {
      title: "Supervisors",
      count: supervisors.length,
      icon: "👨‍🏫",
      className: "green",
    },
  ];

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome to InterHub — Internship Management System.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className={`stat-card ${stat.className}`} key={stat.title}>
            <div className="stat-icon">{stat.icon}</div>

            <div>
              <p>{stat.title}</p>
              <h2>{stat.count}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <section className="card dashboard-card">
        <div className="card-header">
          <h2>Recent Applications</h2>
          <span className="count">
            {applications.length} Total
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Internship</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {applications.slice(0, 5).map((application) => (
                <tr key={application.ApplicationID}>
                  <td className="student-name">
                    {application.StudentName}
                  </td>

                  <td>{application.CompanyName}</td>

                  <td>{application.InternshipTitle}</td>

                  <td>{application.ApplicationDate}</td>

                  <td>
                    <span
                      className={`status-badge status-${application.Status.toLowerCase()}`}
                    >
                      {application.Status}
                    </span>
                  </td>
                </tr>
              ))}

              {applications.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Links */}
      <section className="card quick-links-card">
        <div className="card-header">
          <h2>Quick Links</h2>
        </div>

        <div className="quick-links">
          <button>📋 Audit Log</button>
          <button>📄 Application Details</button>
          <button>👨‍🎓 Add Student</button>
          <button>🏢 Add Company</button>
          <button>💼 Add Internship</button>
          <button>➕ New Application</button>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;