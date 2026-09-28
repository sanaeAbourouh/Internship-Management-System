import { useState } from "react";

function Icon({ name, size = 20 }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (name === "graduation") {
    return (
      <svg {...commonProps}>
        <path d="M2 10l10-5 10 5-10 5L2 10z" />
        <path d="M6 12.5V17c3 2 9 2 12 0v-4.5" />
        <path d="M22 10v6" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg {...commonProps}>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </svg>
    );
  }

  if (name === "login") {
    return (
      <svg {...commonProps}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 4h5v16h-5" />
      </svg>
    );
  }

  if (name === "key") {
    return (
      <svg {...commonProps}>
        <circle cx="8" cy="15" r="4" />
        <path d="M11 12l9-9" />
        <path d="M17 6l2 2" />
        <path d="M15 8l2 2" />
      </svg>
    );
  }

  return null;
}

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      localStorage.setItem(
        "interhub_user",
        JSON.stringify({
          username: data.username,
          role: data.role,
        })
      );

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-icon">
            <Icon name="graduation" size={30} />
          </div>

          <h1>InterHub</h1>

          <p>Internship Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Username</label>

            <div className="login-input-wrapper">
              <span className="input-icon">
                <Icon name="user" size={18} />
              </span>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="login-input-wrapper">
              <span className="input-icon">
                <Icon name="lock" size={18} />
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button login-button"
          >
            <Icon name="login" size={18} />
            <span>Sign In</span>
          </button>
        </form>

        {/* Credential Hints */}
        <div className="credential-hints">

          <div className="credential-title">
            <Icon name="key" size={17} />
            <span>Credential Hints</span>
          </div>

          <div className="credentials-table-wrapper">
            <table className="credentials-table">
              <thead>
                <tr>
                  <th>USERNAME</th>
                  <th>PASSWORD</th>
                  <th>ROLE</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>admin</td>
                  <td>admin123</td>
                  <td>
                    <span className="role-badge role-admin">
                      Admin
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>student</td>
                  <td>student123</td>
                  <td>
                    <span className="role-badge role-student">
                      Student
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>company</td>
                  <td>company123</td>
                  <td>
                    <span className="role-badge role-company">
                      Company
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;