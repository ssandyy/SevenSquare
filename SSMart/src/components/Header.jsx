import React, { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { Link } from "react-router-dom";
import { Badge, ShoppingBag } from "lucide-react";
import CartContext from "../contexts/CartContext";

const Header = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { cartQty } = useContext(CartContext);
  return (
    <div className="flex sticky top-0 z-50 items-center justify-between p-4 bg-white shadow-md">
      <div className="text-xl font-bold">
        {" "}
        <Link to="/">SSMart</Link>
      </div>

      <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 gap-5">
        <div>
          <Link to="/cart" className="flex items-center gap-2 relative">
            <ShoppingBag className="w-6 h-6" />
            {cartQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs border-2 border-white shadow transition-all duration-200">
                {cartQty}
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
          aria-label="Open sidebar"
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
