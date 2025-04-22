import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <nav className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 mr-2">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4F46E5" />
              <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#818CF8" />
            </svg>
          </div>
          <div className="font-bold text-2xl text-white">Tradez</div>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
        <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
        <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link>
        <Link to="/collections" className="text-gray-300 hover:text-white transition-colors">Collections</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link 
              to="/profile" 
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
              <span className="hidden md:inline">{user?.username}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
