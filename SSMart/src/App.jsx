import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import {
  Header,
  MarketingPromo,
  Home,
  ProductDetails,
  CartDetails,
  FrontendLayout,
} from "./components";
import { useContext } from "react";
import { ProductContext } from "./contexts/ProductContext";
import { AdminProvider } from "./contexts/AdminContext";
import CategoryPage from "./pages/CategoryPage";

// Admin Components
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Products from "./components/admin/Products";
import Orders from "./components/admin/Orders";
import Customers from "./components/admin/Customers";
import StorageManager from "./components/admin/StorageManager";
import ProtectedRoute from "./components/admin/ProtectedRoute";

function App() {
  const { products } = useContext(ProductContext);

  return (
    <AdminProvider>
      <Router>
        {/* Frontend Routes */}
        <Routes>
          <Route element={<FrontendLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/marketing" element={<MarketingPromo />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<CartDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="storage" element={<StorageManager />} />
            <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Coming soon...</p></div>} />
          </Route>
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
