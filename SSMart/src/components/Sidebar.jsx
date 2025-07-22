import { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { Link } from "react-router-dom";
import Button from "./parts/Button";
import CartContext from "../contexts/CartContext";

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useContext(SidebarContext);


  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
      />
      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <Button><Link to="/login">Login</Link> </Button> 
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-4">
        
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">
            <div className="flex items-center gap-2">
              <span className="text-sm">Cart</span>
              {/* <span className="text-sm">{cart.length}</span> */}
            </div>
          </Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
          
          {/* Add more links or content here */}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;