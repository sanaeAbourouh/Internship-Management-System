import os
from functools import wraps

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from dotenv import load_dotenv

from backend.db import get_db


load_dotenv()


app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY")

CORS(
    app,
    origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    supports_credentials=True
)


# ============================================================
# Authentication / Authorization
# ============================================================

def role_required(*allowed_roles):
    def decorator(route_function):
        @wraps(route_function)
        def wrapper(*args, **kwargs):
            role = session.get("role")

            if not role:
                return jsonify({
                    "error": "Authentication required"
                }), 401

            if role not in allowed_roles:
                return jsonify({
                    "error": "You do not have permission to perform this action"
                }), 403

            return route_function(*args, **kwargs)

        return wrapper

    return decorator


# ============================================================
# Health
# ============================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "InterHub API is running"
    })


# ============================================================
# Students
# ============================================================

@app.route("/api/students", methods=["GET"])
@role_required("admin", "student")
def get_students():
    conn = get_db()

    try:
        rows = conn.execute(
            """
            SELECT StudentID, Name, Email, Major, Phone
            FROM Student
            ORDER BY StudentID
            """
        ).fetchall()

        students = [dict(row) for row in rows]

        return jsonify(students)

    finally:
        conn.close()


@app.route("/api/students", methods=["POST"])
@role_required("admin")
def create_student():
    data = request.get_json()

    name = data.get("Name")
    email = data.get("Email")
    major = data.get("Major", "")
    phone = data.get("Phone", "")

    if not name or not email:
        return jsonify({
            "error": "Name and Email are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            INSERT INTO Student (Name, Email, Major, Phone)
            VALUES (?, ?, ?, ?)
            """,
            (name, email, major, phone)
        )

        conn.commit()

        return jsonify({
            "message": "Student created successfully",
            "StudentID": cursor.lastrowid
        }), 201

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/students/<int:student_id>", methods=["PUT"])
@role_required("admin")
def update_student(student_id):
    data = request.get_json()

    name = data.get("Name")
    email = data.get("Email")
    major = data.get("Major", "")
    phone = data.get("Phone", "")

    if not name or not email:
        return jsonify({
            "error": "Name and Email are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            UPDATE Student
            SET Name = ?,
                Email = ?,
                Major = ?,
                Phone = ?
            WHERE StudentID = ?
            """,
            (
                name,
                email,
                major,
                phone,
                student_id
            )
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Student not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Student updated successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/students/<int:student_id>", methods=["DELETE"])
@role_required("admin")
def delete_student(student_id):
    conn = get_db()

    try:
        cursor = conn.execute(
            "DELETE FROM Student WHERE StudentID = ?",
            (student_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Student not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Student deleted successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


# ============================================================
# Companies
# ============================================================

@app.route("/api/companies", methods=["GET"])
@role_required("admin", "company")
def get_companies():
    conn = get_db()

    try:
        rows = conn.execute(
            """
            SELECT
                CompanyID,
                CompanyName,
                Email,
                Address,
                Phone,
                Industry
            FROM Company
            ORDER BY CompanyID
            """
        ).fetchall()

        companies = [dict(row) for row in rows]

        return jsonify(companies)

    finally:
        conn.close()


@app.route("/api/companies", methods=["POST"])
@role_required("admin", "company")
def create_company():
    data = request.get_json()

    company_name = data.get("CompanyName")
    email = data.get("Email")
    address = data.get("Address", "")
    phone = data.get("Phone", "")
    industry = data.get("Industry", "")

    if not company_name or not email:
        return jsonify({
            "error": "CompanyName and Email are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            INSERT INTO Company
            (CompanyName, Email, Address, Phone, Industry)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                company_name,
                email,
                address,
                phone,
                industry
            )
        )

        conn.commit()

        return jsonify({
            "message": "Company created successfully",
            "CompanyID": cursor.lastrowid
        }), 201

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/companies/<int:company_id>", methods=["PUT"])
@role_required("admin", "company")
def update_company(company_id):
    data = request.get_json()

    company_name = data.get("CompanyName")
    email = data.get("Email")
    address = data.get("Address", "")
    phone = data.get("Phone", "")
    industry = data.get("Industry", "")

    if not company_name or not email:
        return jsonify({
            "error": "CompanyName and Email are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            UPDATE Company
            SET CompanyName = ?,
                Email = ?,
                Address = ?,
                Phone = ?,
                Industry = ?
            WHERE CompanyID = ?
            """,
            (
                company_name,
                email,
                address,
                phone,
                industry,
                company_id
            )
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Company not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Company updated successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/companies/<int:company_id>", methods=["DELETE"])
@role_required("admin", "company")
def delete_company(company_id):
    conn = get_db()

    try:
        cursor = conn.execute(
            "DELETE FROM Company WHERE CompanyID = ?",
            (company_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Company not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Company deleted successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


# ============================================================
# Supervisors
# ============================================================

@app.route("/api/supervisors", methods=["GET"])
@role_required("admin", "company")
def get_supervisors():
    conn = get_db()

    try:
        rows = conn.execute(
            """
            SELECT
                SupervisorID,
                Name,
                Email,
                Phone
            FROM Supervisor
            ORDER BY SupervisorID
            """
        ).fetchall()

        supervisors = [dict(row) for row in rows]

        return jsonify(supervisors)

    finally:
        conn.close()


@app.route("/api/supervisors", methods=["POST"])
@role_required("admin")
def create_supervisor():
    data = request.get_json()

    name = data.get("Name")
    email = data.get("Email")
    phone = data.get("Phone", "")

    if not name or not email:
        return jsonify({
            "error": "Name and Email are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            INSERT INTO Supervisor (Name, Email, Phone)
            VALUES (?, ?, ?)
            """,
            (name, email, phone)
        )

        conn.commit()

        return jsonify({
            "message": "Supervisor created successfully",
            "SupervisorID": cursor.lastrowid
        }), 201

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/supervisors/<int:supervisor_id>", methods=["PUT"])
@role_required("admin")
def update_supervisor(supervisor_id):
    data = request.get_json()

    name = data.get("Name")
    email = data.get("Email")
    phone = data.get("Phone", "")

    if not name or not email:
        return jsonify({
            "error": "Name and Email are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            UPDATE Supervisor
            SET Name = ?,
                Email = ?,
                Phone = ?
            WHERE SupervisorID = ?
            """,
            (
                name,
                email,
                phone,
                supervisor_id
            )
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Supervisor not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Supervisor updated successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/supervisors/<int:supervisor_id>", methods=["DELETE"])
@role_required("admin")
def delete_supervisor(supervisor_id):
    conn = get_db()

    try:
        cursor = conn.execute(
            "DELETE FROM Supervisor WHERE SupervisorID = ?",
            (supervisor_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Supervisor not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Supervisor deleted successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


# ============================================================
# Internships
# ============================================================

@app.route("/api/internships", methods=["GET"])
@role_required("admin", "student", "company")
def get_internships():
    conn = get_db()

    try:
        rows = conn.execute(
            """
            SELECT
                i.InternshipID,
                i.Title,
                i.Description,
                i.Duration,
                i.Salary,
                i.Location,
                i.CompanyID,
                c.CompanyName,
                i.SupervisorID,
                s.Name AS SupervisorName
            FROM Internship i
            JOIN Company c
                ON i.CompanyID = c.CompanyID
            JOIN Supervisor s
                ON i.SupervisorID = s.SupervisorID
            ORDER BY i.InternshipID
            """
        ).fetchall()

        internships = [dict(row) for row in rows]

        return jsonify(internships)

    finally:
        conn.close()


@app.route("/api/internships", methods=["POST"])
@role_required("admin", "company")
def create_internship():
    data = request.get_json()

    title = data.get("Title")
    description = data.get("Description", "")
    duration = data.get("Duration", "")
    salary = data.get("Salary", "")
    location = data.get("Location", "")
    company_id = data.get("CompanyID")
    supervisor_id = data.get("SupervisorID")

    if not title or not company_id or not supervisor_id:
        return jsonify({
            "error": "Title, CompanyID and SupervisorID are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            INSERT INTO Internship
            (
                Title,
                Description,
                Duration,
                Salary,
                Location,
                CompanyID,
                SupervisorID
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                title,
                description,
                duration,
                salary,
                location,
                company_id,
                supervisor_id
            )
        )

        conn.commit()

        return jsonify({
            "message": "Internship created successfully",
            "InternshipID": cursor.lastrowid
        }), 201

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/internships/<int:internship_id>", methods=["PUT"])
@role_required("admin", "company")
def update_internship(internship_id):
    data = request.get_json()

    title = data.get("Title")
    description = data.get("Description", "")
    duration = data.get("Duration", "")
    salary = data.get("Salary", "")
    location = data.get("Location", "")
    company_id = data.get("CompanyID")
    supervisor_id = data.get("SupervisorID")

    if not title or not company_id or not supervisor_id:
        return jsonify({
            "error": "Title, CompanyID and SupervisorID are required"
        }), 400

    conn = get_db()

    try:
        cursor = conn.execute(
            """
            UPDATE Internship
            SET Title = ?,
                Description = ?,
                Duration = ?,
                Salary = ?,
                Location = ?,
                CompanyID = ?,
                SupervisorID = ?
            WHERE InternshipID = ?
            """,
            (
                title,
                description,
                duration,
                salary,
                location,
                company_id,
                supervisor_id,
                internship_id
            )
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Internship not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Internship updated successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/internships/<int:internship_id>", methods=["DELETE"])
@role_required("admin", "company")
def delete_internship(internship_id):
    conn = get_db()

    try:
        cursor = conn.execute(
            "DELETE FROM Internship WHERE InternshipID = ?",
            (internship_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Internship not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Internship deleted successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


# ============================================================
# Applications
# ============================================================

@app.route("/api/applications", methods=["GET"])
@role_required("admin", "student", "company")
def get_applications():
    conn = get_db()

    try:
        rows = conn.execute(
            """
            SELECT
                a.ApplicationID,
                a.ApplicationDate,
                a.Status,
                s.Name AS StudentName,
                s.Email AS StudentEmail,
                s.Major,
                c.CompanyName,
                i.Title AS InternshipTitle,
                i.Duration,
                i.Salary,
                i.Location,
                sup.Name AS SupervisorName,
                sup.Email AS SupervisorEmail
            FROM Application a
            JOIN Student s
                ON a.StudentID = s.StudentID
            JOIN Internship i
                ON a.InternshipID = i.InternshipID
            JOIN Company c
                ON i.CompanyID = c.CompanyID
            JOIN Supervisor sup
                ON i.SupervisorID = sup.SupervisorID
            ORDER BY a.ApplicationDate DESC
            """
        ).fetchall()

        applications = [dict(row) for row in rows]

        return jsonify(applications)

    finally:
        conn.close()


@app.route("/api/applications", methods=["POST"])
@role_required("admin", "student")
def create_application():
    data = request.get_json()

    student_id = data.get("StudentID")
    internship_id = data.get("InternshipID")

    if not student_id or not internship_id:
        return jsonify({
            "error": "StudentID and InternshipID are required"
        }), 400

    conn = get_db()

    try:
        student = conn.execute(
            """
            SELECT StudentID
            FROM Student
            WHERE StudentID = ?
            """,
            (student_id,)
        ).fetchone()

        if not student:
            return jsonify({
                "error": "Student not found"
            }), 404

        internship = conn.execute(
            """
            SELECT InternshipID
            FROM Internship
            WHERE InternshipID = ?
            """,
            (internship_id,)
        ).fetchone()

        if not internship:
            return jsonify({
                "error": "Internship not found"
            }), 404

        existing = conn.execute(
            """
            SELECT ApplicationID
            FROM Application
            WHERE StudentID = ?
              AND InternshipID = ?
            """,
            (
                student_id,
                internship_id
            )
        ).fetchone()

        if existing:
            return jsonify({
                "error": "Student has already applied for this internship"
            }), 409

        cursor = conn.execute(
            """
            INSERT INTO Application
            (StudentID, InternshipID, Status)
            VALUES (?, ?, 'Applied')
            """,
            (
                student_id,
                internship_id
            )
        )

        conn.commit()

        return jsonify({
            "message": "Application created successfully",
            "ApplicationID": cursor.lastrowid
        }), 201

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/applications/<int:application_id>", methods=["PUT"])
@role_required("admin", "company")
def update_application(application_id):
    data = request.get_json()

    new_status = data.get("Status")

    allowed_statuses = [
        "Applied",
        "Shortlisted",
        "Interviewed",
        "Offered",
        "Placed",
        "Rejected"
    ]

    if new_status not in allowed_statuses:
        return jsonify({
            "error": "Invalid application status"
        }), 400

    conn = get_db()

    try:
        application = conn.execute(
            """
            SELECT Status
            FROM Application
            WHERE ApplicationID = ?
            """,
            (application_id,)
        ).fetchone()

        if not application:
            return jsonify({
                "error": "Application not found"
            }), 404

        old_status = application["Status"]

        conn.execute(
            """
            UPDATE Application
            SET Status = ?
            WHERE ApplicationID = ?
            """,
            (
                new_status,
                application_id
            )
        )

        if old_status != new_status:
            conn.execute(
                """
                INSERT INTO ApplicationAudit
                (ApplicationID, OldStatus, NewStatus)
                VALUES (?, ?, ?)
                """,
                (
                    application_id,
                    old_status,
                    new_status
                )
            )

        conn.commit()

        return jsonify({
            "message": "Application updated successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()


@app.route("/api/applications/<int:application_id>", methods=["DELETE"])
@role_required("admin")
def delete_application(application_id):
    conn = get_db()

    try:
        cursor = conn.execute(
            """
            DELETE FROM Application
            WHERE ApplicationID = ?
            """,
            (application_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "Application not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Application deleted successfully"
        })

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    finally:
        conn.close()

@app.route("/api/application-details", methods=["GET"])
@role_required("admin", "student", "company")
def get_application_details():
    conn = get_db()

    rows = conn.execute("""
        SELECT
            ApplicationID,
            StudentName,
            StudentEmail,
            Major,
            CompanyName,
            InternshipTitle,
            Duration,
            Salary,
            Location,
            SupervisorName,
            SupervisorEmail,
            ApplicationDate,
            Status
        FROM ApplicationDetails
        ORDER BY ApplicationDate DESC
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])

@app.route("/api/audit-log", methods=["GET"])
@role_required("admin")
def get_audit_log():
    conn = get_db()

    rows = conn.execute("""
        SELECT
            AuditID,
            ApplicationID,
            OldStatus,
            NewStatus,
            ChangeDate,
            ChangedBy
        FROM ApplicationAudit
        ORDER BY ChangeDate DESC, AuditID DESC
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])
# ============================================================
# Authentication
# ============================================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    users = {
        os.getenv("ADMIN_USERNAME"): {
            "password": os.getenv("ADMIN_PASSWORD"),
            "role": "admin"
        },
        os.getenv("STUDENT_USERNAME"): {
            "password": os.getenv("STUDENT_PASSWORD"),
            "role": "student"
        },
        os.getenv("COMPANY_USERNAME"): {
            "password": os.getenv("COMPANY_PASSWORD"),
            "role": "company"
        }
    }

    user = users.get(username)

    if not user or user["password"] != password:
        return jsonify({
            "error": "Invalid username or password"
        }), 401

    session["username"] = username
    session["role"] = user["role"]

    return jsonify({
        "message": "Login successful",
        "username": username,
        "role": user["role"]
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({
        "message": "Logout successful"
    })


# ============================================================
# Run Application
# ============================================================

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )