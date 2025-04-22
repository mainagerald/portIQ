import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-100 text-gray-500 text-center py-3 mt-auto border-t">
    <span>© {new Date().getFullYear()} Tradez. All rights reserved.</span>
  </footer>
);

export default Footer;
