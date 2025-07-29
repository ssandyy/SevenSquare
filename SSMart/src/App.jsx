import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import {
  CartDetails,
  FrontendLayout,
  Home,
  MarketingPromo,
  ProductDetails
} from "./components";
import AdminLayout from "./components/admin/AdminLayout";
import Customers from "./components/admin/Customers";
import Dashboard from "./components/admin/Dashboard";
import Orders from "./components/admin/Orders";
import Products from "./components/admin/Products";
import StorageManager from "./components/admin/StorageManager";
import UserManagement from "./components/admin/UserManagement";
import CreateAdmin from "./components/admin/CreateAdmin";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/ProtectedRoute";
import Signup from "./components/auth/Signup";
import Wishlist from "./components/Wishlist";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import CategoryPage from "./pages/CategoryPage";
// import ProtectedRoute from "./components/admin/ProtectedRoute";

function App() {
  // const { products } = useContext(ProductContext);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            {/* Frontend Routes */}
            <Routes>
              <Route element={<FrontendLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/marketing" element={<MarketingPromo />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/cart" element={<CartDetails />} />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } />
              

              {/* Auth Routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              </Route>

          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="create-admin" element={<CreateAdmin />} />
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="storage" element={<StorageManager />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Coming soon...</p></div>} />
          </Route>
        </Routes>
      </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
