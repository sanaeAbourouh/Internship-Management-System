InterHub — Internship Management System
Clean formatted reference for the project README. The actual GitHub README should remain Markdown text.


Project Overview 
A web-based internship management system designed to help students, companies, and administrators manage internship opportunities and applications in one centralized platform. 

InterHub provides role-based access, internship management, application tracking, application details, and audit logging through a React frontend and Flask backend. 

Key Features 
Authentication & Authorization 
• Secure login system 
• Session-based authentication 
• Role-based access control (RBAC) 
• Separate permissions for Admin, Student, and Company users 
• Protected API endpoints 
Internship Management 
• View available internships 
• Create and manage internship opportunities 
• Assign company supervisors 
• Track title, duration, salary, location, company, and supervisor 
Application Management 
• Submit applications 
• View application records 
• Update application status 
• Track application progress 
• View detailed application information 
Audit Log 
Records application status changes, including application ID, previous status, new status, change date, and user. 
Dashboard 
Statistics overview, recent applications, quick actions, application management shortcuts, and role-aware information. 

User Roles & Permissions 
Feature Admin 
Features	Admin	Student	Company
Dashboard 	✓	✓	✓
View Students 	✓	✓	—
Manage Students 	✓	—	—
Manage Students 	✓	—	✓
View Companies 	✓	—	✓
Manage Companies 	✓	✓	✓
View Internships 	✓	—	✓
Manage Internships	✓	✓	✓
View Applications 	✓	✓	—
Create Applications 	✓	—	✓
Update Applications 	✓	—	—
Delete Applications	✓	—	✓
Audit Log 	✓	—	—

Permissions are enforced on the backend as well as reflected in the frontend interface. 
Technology Stack 
Frontend: React, JavaScript, CSS, React Router, Fetch API 
Backend: Python, Flask, Flask-CORS, Python-dotenv, REST API 
Database: SQLite 
Tools: Visual Studio Code, Git, GitHub, npm 

System Architecture 
React Frontend
 ■
           ■ REST API
 ▼
Flask Backend
■
     ■ SQL
▼
SQLite Database

Project Structure 
Internship-Management-System/ 
■■■ backend/ 
■   ■■■ app.py 
■   ■■■ db.py 
■   ■■■ .env.example 
■   ■■■ .env 
■■■ public/ 
■■■ src/ 
■   ■■■ App.js 
■   ■■■ App.css 
■   ■■■ api.js 
■   ■■■ LoginPage.jsx 
■   ■■■ Dashboard.jsx 
■   ■■■ StudentsPage.jsx 
■   ■■■ CompaniesPage.jsx 
■   ■■■ InternshipsPage.jsx 
■   ■■■ ApplicationsPage.jsx 
■   ■■■ ApplicationDetailsPage.jsx 
■   ■■■ AuditLogPage.jsx 
■   ■■■ SupervisorsPage.jsx 
■■■ .gitignore 
■■■ package.json 
■■■ package-lock.json 
■■■ README.md 

Getting Started 
Prerequisites: Node.js, npm, Python 3, and Git. 
git clone https://github.com/sanaeAbourouh/Internship-Management-System.git 
cd Internship-Management-System 
npm install 
Configure the backend: 
cd backend
cp .env.example .env 
Install backend dependencies: 
pip install flask flask-cors python-dotenv 
Start backend: 
python backend/app.py 
Start frontend in another terminal: 
npm start 


Demo Accounts 
R
Role	Username	Password
Administrator 	admin	admin123
Student	student	student123
Company	company	company123
ol
These credentials are intended for local demonstration purposes. 


API Overview 
/api/login 
/api/logout 
/api/students 
/api/companies 
/api/supervisors 
/api/internships 
/api/applications 
/api/application-details 
/api/audit-log 


Security 
The project uses environment variables for secrets, excludes .env from version control, uses session-based authentication, backend role-based authorization, protected API endpoints, local CORS configuration, and SQLite foreign-key enforcement. 

This project is intended for educational and portfolio purposes and is not a production-ready authentication system. 


Future Improvements 
• Password hashing and persistent user accounts 
• Advanced authentication 
• Email notifications 
• Advanced search and filtering 
• Application analytics 
• Student and company profiles 
• CV and file uploads 
• Cloud deployment 
• Automated testing 
• Production database such as PostgreSQL 


Author 
Sanae Abourouh 
Computer Science Student 

License
This project was developed for educational and portfolio purposes.
