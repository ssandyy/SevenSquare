import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CartContext from "../contexts/CartContext";
import { ProductContext } from "../contexts/ProductContext";
import { SidebarContext } from "../contexts/SidebarContext";
import { useWishlist } from "../contexts/WishlistContext";

const Header = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { cartQty } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  const { currentUser, signOut } = useAuth();
  const { wishlistCount, refreshWishlist } = useWishlist();
  
  // Debug: Log wishlist count
  console.log('Header wishlist count:', wishlistCount, 'currentUser:', currentUser?.uid || 'null');

  // Refresh wishlist when user changes
  useEffect(() => {
    console.log('Header: currentUser changed:', currentUser?.uid || 'null');
    if (currentUser) {
      refreshWishlist();
    }
  }, [currentUser?.uid, refreshWishlist]); // Use currentUser.uid instead of currentUser


  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Get unique categories from products
  const categories = [...new Set(products.map((product) => product.category))]
    .map((category) => ({
      name: category.toUpperCase(),
      href: `/category/${category}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Handle click outside search dropdown and user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  const handleSearchSubmit = () => {
    if (searchResults.length > 0) {
      // Navigate to search results page or show results
      setShowSearchResults(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 +91 6262232398</span>
              <span>📧 support@ssmart.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-blue-200 transition-colors">
                Track Order
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                Store Locator
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            SSMart
          </Link>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button 
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Search
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{product.title}</h4>
                      <p className="text-gray-500 text-xs">{product.category}</p>
                    </div>
                  </Link>
                ))}
                {searchResults.length > 5 && (
                  <div className="p-3 text-center text-sm text-gray-500 border-t">
                    View all {searchResults.length} results
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
            >
              <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
              {currentUser && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-medium animate-pulse">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>



            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                
                {currentUser ? (
                  // <User className="w-6 h-6 text-gray-600" />
                  <span className="text-gray-500 text-xs">{currentUser.displayName || currentUser.email}</span>
                ) : (
                  <span className="text-gray-500 text-xs">Sign In</span>
                )}
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-medium">{currentUser.displayName || currentUser.email}</p>
                        <p className="text-gray-500 text-xs">{currentUser.role}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          console.log('Header: Signing out user');
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="inline w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-gray-600" />
              {currentUser && cartQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {cartQty}
              </span>
            )}
          </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button 
              onClick={handleSearchSubmit}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Search
        </button>
      </div>
    </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Categories Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="py-4 px-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Deals Badge */}
            <div className="hidden md:flex items-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🔥 Flash Sale - 50% Off!
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🔥 Flash Sale - 50% Off!
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
