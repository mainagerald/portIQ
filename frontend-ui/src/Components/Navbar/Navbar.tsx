import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo-b.png";
import { useAuth } from "../../Context/useAuth";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-200 to-indigo-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-12" />
          </Link>
          <div className="hidden md:flex space-x-6 text-gray-800 font-semibold">
            <Link to="/search" className="relative px-4 py-2 rounded-full bg-white shadow-md hover:bg-opacity-75 transition duration-300">
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="mr-14 w-4 h-4 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="ml-6">Search</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn() ? (
            <div className="hidden md:flex items-center space-x-4 text-gray-800">
              <div>Welcome, {user?.userName}</div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4 text-gray-800">
              <Link
                to="/login"
                className="hover:text-blue-600 font-semibold transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 hover:text-blue-600 text-blue-500 font-semibold transition-colors duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
