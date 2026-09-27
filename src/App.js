import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Dashboard from "./Dashboard";
import StudentsPage from "./StudentsPage";
import CompaniesPage from "./CompaniesPage";
import InternshipsPage from "./InternshipsPage";
import ApplicationsPage from "./ApplicationsPage";
import SupervisorsPage from "./SupervisorsPage";
import LoginPage from "./LoginPage";

import "./App.css";


function getCurrentUser() {
  const savedUser = localStorage.getItem("interhub_user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem("interhub_user");
    return null;
  }
}


function ProtectedRoute({ children, allowedRoles }) {
  const user = getCurrentUser();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but role is not allowed
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


function Layout() {
  const user = getCurrentUser();

  const role = user?.role;
  const username = user?.username;

  const handleLogout = () => {
    localStorage.removeItem("interhub_user");
    window.location.href = "/login";
  };

  return (
    <div className="app">

      {/* =========================
          NAVBAR
          ========================= */}

      {user && (
        <nav className="navbar">

          <div className="brand">
            <span className="brand-icon">🎓</span>
            <span>InterHub</span>
          </div>


          <div className="nav-links">

            <Link to="/dashboard">
              Dashboard
            </Link>


            {/* ADMIN */}
            {role === "admin" && (
              <>
                <Link to="/students">
                  Students
                </Link>

                <Link to="/companies">
                  Companies
                </Link>

                <Link to="/internships">
                  Internships
                </Link>

                <Link to="/applications">
                  Applications
                </Link>

                <Link to="/supervisors">
                  Supervisors
                </Link>
              </>
            )}


            {/* STUDENT */}
            {role === "student" && (
              <>
                <Link to="/internships">
                  Internships
                </Link>

                <Link to="/applications">
                  Applications
                </Link>

                <Link to="/students">
                  Students
                </Link>
              </>
            )}


            {/* COMPANY */}
            {role === "company" && (
              <>
                <Link to="/companies">
                  Companies
                </Link>

                <Link to="/internships">
                  Internships
                </Link>

                <Link to="/applications">
                  Applications
                </Link>
              </>
            )}

          </div>


          {/* USER AREA */}

          <div className="user-area">

            <span className="user-badge">
              {username
                ? username.charAt(0).toUpperCase()
                : "U"}
            </span>

            <span>
              {username}
            </span>

            <button
              className="logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </nav>
      )}


      {/* =========================
          ROUTES
          ========================= */}

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "student",
                "company",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* STUDENTS */}

        <Route
          path="/students"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "student",
              ]}
            >
              <StudentsPage />
            </ProtectedRoute>
          }
        />


        {/* COMPANIES */}

        <Route
          path="/companies"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "company",
              ]}
            >
              <CompaniesPage />
            </ProtectedRoute>
          }
        />


        {/* INTERNSHIPS */}

        <Route
          path="/internships"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "student",
                "company",
              ]}
            >
              <InternshipsPage />
            </ProtectedRoute>
          }
        />


        {/* APPLICATIONS */}

        <Route
          path="/applications"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "student",
                "company",
              ]}
            >
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />


        {/* SUPERVISORS — ADMIN ONLY */}

        <Route
          path="/supervisors"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <SupervisorsPage />
            </ProtectedRoute>
          }
        />


        {/* ROOT */}

        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />


        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <Navigate
              to={
                user
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>


      {/* =========================
          FOOTER
          ========================= */}

      {user && (
        <footer>
          © 2026 InterHub — Internship Management System
        </footer>
      )}

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}


export default App;