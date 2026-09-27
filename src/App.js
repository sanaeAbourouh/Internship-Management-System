import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import CompaniesPage from './pages/CompaniesPage';
import InternshipsPage from './pages/InternshipsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;