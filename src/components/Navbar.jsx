import React, { useState } from 'react';
import { FaSignOutAlt, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { loginWithPopup, logout, user, isAuthenticated } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  const handleHome = () => {
    window.location.href = window.location.origin;
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <nav className="sticky top-0 z-50 bg-cyan-700 backdrop-blur-lg border-b border-white border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-black text-xl sm:text-2xl font-bold tracking-widest uppercase">Datasense</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleHome}
              className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 shadow-md hover:shadow-lg text-sm"
            >
              Home
            </button>
            {!isAuthenticated ? (
              <button
                onClick={() => loginWithPopup()}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-md hover:shadow-lg text-sm"
              >
                Log In
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium text-sm">
                  Welcome, {getFirstName(user.name)}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 shadow-md hover:shadow-lg text-sm"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={handleHome}
              className="text-white hover:bg-cyan-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              <FaHome className="inline-block mr-2" /> Home
            </button>
            {!isAuthenticated ? (
              <button
                onClick={() => loginWithPopup()}
                className="text-white hover:bg-cyan-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Log In
              </button>
            ) : (
              <>
                <div className="text-white px-3 py-2 text-sm">
                  Welcome, {getFirstName(user.name)}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-cyan-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  <FaSignOutAlt className="inline-block mr-2" /> Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;