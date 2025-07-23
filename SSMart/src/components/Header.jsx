import React, { useContext } from 'react';
import { SidebarContext } from '../contexts/SidebarContext';

const Header = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="text-xl font-bold">SSMart</div>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
        aria-label="Open sidebar"
      >
        {/* Hamburger Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
};

export default Header;
