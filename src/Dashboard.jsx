import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

/* =========================
   SIMPLE SVG ICONS
   ========================= */

function Icon({ type }) {
  const icons = {
    students: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="9"
          cy="7"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    companies: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 21V7h8v14M7 11h2M7 15h2M15 11h2M15 15h2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),

    internships: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    applications: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 2v6h6M8 13h8M8 17h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    supervisors: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="8"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M4 21a8 8 0 0 1 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M19 5v4M17 7h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    audit: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 2v6h6M8 13h8M8 17h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    details: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 4h16v16H4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 9h8M8 13h8M8 17h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    addStudent: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="9"
          cy="8"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    addCompany: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="15"
          height="18"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M7 7h2M7 11h2M7 15h2M13 7h2M13 11h2M13 15h2M18 9h3v12h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),

    addInternship: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 11v6M9 14h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    newApplication: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 2v6h6M12 12v6M9 15h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return icons[type] || null;
}


/* =========================
   DASHBOARD
   ========================= */

function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          studentsData,
          companiesData,
          internshipsData,
          applicationsData,
          supervisorsData,
        ] = await Promise.all([
          apiFetch("/students"),
          apiFetch("/companies"),
          apiFetch("/internships"),
          apiFetch("/applications"),
          apiFetch("/supervisors"),
        ]);

        setStudents(studentsData);
        setCompanies(companiesData);
        setInternships(internshipsData);
        setApplications(applicationsData);
        setSupervisors(supervisorsData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Students",
      count: students.length,
      icon: "students",
      className: "purple",
    },
    {
      title: "Companies",
      count: companies.length,
      icon: "companies",
      className: "blue",
    },
    {
      title: "Internships",
      count: internships.length,
      icon: "internships",
      className: "pink",
    },
    {
      title: "Applications",
      count: applications.length,
      icon: "applications",
      className: "orange",
    },
    {
      title: "Supervisors",
      count: supervisors.length,
      icon: "supervisors",
      className: "green",
    },
  ];

  const quickActions = [
    {
      title: "Audit Log",
      description: "Review application status changes",
      icon: "audit",
      className: "purple",
      action: () => navigate("/audit-log"),
    },
    {
      title: "Application Details",
      description: "View complete application information",
      icon: "details",
      className: "blue",
      action: () => navigate("/application-details"),
    },
    {
      title: "Add Student",
      description: "Register a new student",
      icon: "addStudent",
      className: "green",
      action: () => navigate("/students?action=add"),
    },
    {
      title: "Add Company",
      description: "Register a new company",
      icon: "addCompany",
      className: "orange",
      action: () => navigate("/companies?action=add"),
    },
    {
      title: "Add Internship",
      description: "Create a new internship listing",
      icon: "addInternship",
      className: "pink",
      action: () => navigate("/internships?action=add"),
    },
    {
      title: "New Application",
      description: "Create an internship application",
      icon: "newApplication",
      className: "purple",
      action: () => navigate("/applications?action=add"),
    },
  ];

  return (
    <main className="main-content dashboard-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="page-header dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome to InterHub — Internship Management System.
          </p>
        </div>
      </div>


      {/* =========================
          STATISTICS
          ========================= */}

      <div className="stats-grid">
        {stats.map((stat) => (
          <div
            className={`stat-card ${stat.className}`}
            key={stat.title}
          >
            <div className="stat-icon">
              <Icon type={stat.icon} />
            </div>

            <div className="stat-content">
              <p>{stat.title}</p>
              <h2>{stat.count}</h2>
            </div>
          </div>
        ))}
      </div>


      {/* =========================
          RECENT APPLICATIONS
          ========================= */}

      <section className="card dashboard-card">

        <div className="card-header">
          <div>
            <h2>Recent Applications</h2>
            <p className="section-subtitle">
              Latest internship applications
            </p>
          </div>

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

                  <td>
                    {application.CompanyName}
                  </td>

                  <td>
                    {application.InternshipTitle}
                  </td>

                  <td>
                    {application.ApplicationDate}
                  </td>

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
                  <td
                    colSpan="5"
                    className="empty-state"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        <div className="dashboard-table-footer">
          <button
            className="view-all-button"
            onClick={() => navigate("/applications")}
          >
            View all applications
            <span>→</span>
          </button>
        </div>

      </section>


      {/* =========================
          QUICK ACTIONS
          ========================= */}

      <section className="quick-actions-section">

        <div className="quick-actions-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Common actions for your role</p>
          </div>
        </div>

        <div className="quick-actions-grid">

          {quickActions.map((action) => (
            <button
              key={action.title}
              className="quick-action-card"
              onClick={action.action}
            >

              <div className={`quick-action-icon ${action.className}`}>
                <Icon type={action.icon} />
              </div>

              <div className="quick-action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>

              <span className="quick-action-arrow">
                →
              </span>

            </button>
          ))}

        </div>

      </section>

    </main>
  );
}

export default Dashboard;