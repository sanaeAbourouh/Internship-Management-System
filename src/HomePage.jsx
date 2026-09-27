import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const systemModules = [
    {
      id: 1,
      title: "Student Management",
      description: "Manage student profiles, track academic progress, and handle student records",
      icon: "👨‍🎓",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Company Management",
      description: "Register companies, manage partnerships, and maintain company profiles",
      icon: "🏢",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      title: "Internship Management",
      description: "Post internship opportunities, set requirements, and manage positions",
      icon: "💼",
      color: "from-pink-500 to-pink-600"
    },
    {
      id: 4,
      title: "Application Management",
      description: "Process student applications, track submissions, and manage reviews",
      icon: "📝",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: 5,
      title: "Status Tracking",
      description: "Real-time tracking of application status and internship progress",
      icon: "📊",
      color: "from-green-500 to-green-600"
    },
    {
      id: 6,
      title: "Administration",
      description: "System configuration, user management, and reporting tools",
      icon: "👑",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
              Welcome to Internship Management System
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your Gateway to Professional Success! Connect students with amazing internship opportunities and streamline the entire process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/students"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="#modules"
                className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="modules" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            System Modules
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive modules designed to streamline your internship management process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systemModules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-r ${module.color} p-4`}>
                <div className="text-5xl mb-2">{module.icon}</div>
                <h3 className="text-xl font-bold text-white">{module.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {module.description}
                </p>
                <Link
                  to="#"
                  className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center"
                >
                  Learn More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Active Internships</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">200+</div>
              <div className="text-gray-600">Applications Processed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-lg mb-6 opacity-90">Join thousands of students who have found their dream internships through our platform</p>
          <Link
            to="/students"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;