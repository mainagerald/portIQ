import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="font-bold text-xl text-gray-800">Tradez</div>
      <div>
        {/* Add navigation links or user menu here */}
      </div>
    </nav>
  );
};

export default Navbar;
