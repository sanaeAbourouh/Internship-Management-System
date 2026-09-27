import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/students', label: 'Students' },
    { path: '/companies', label: 'Companies' },
    { path: '/internships', label: 'Internships' },
    { path: '/applications', label: 'Applications' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">IMS</span>
            </div>
            <span className="text-white font-bold text-xl">
              Internship Management System
            </span>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition duration-300 font-medium ${
                  location.pathname === link.path
                    ? 'bg-white text-purple-600'
                    : 'text-white hover:bg-white hover:text-purple-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;