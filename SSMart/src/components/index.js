import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import CartDetails from '../pages/CartDetails';
import CategoryPage from '../pages/CategoryPage';
import CartItem from './CartItem';
import Footer from './Footer';
import Header from './Header';
import Product from './Product';
import Sidebar from './Sidebar';
import MarketingPromo from './MarketingPromo';
import Pagination from './pagination/Pagination';
import usePagination from './pagination/usePagination';
import PaginatedList from './PaginatedList';
import Button from './parts/Button';
import Input from './parts/Input';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Orders from './admin/Orders';
import Customers from './admin/Customers';
import StorageManager from './admin/StorageManager';
import ProtectedRoute from './admin/ProtectedRoute';

// Layout Components
import FrontendLayout from '../layouts/FrontendLayout';

export { 
  CartItem, 
  Footer, 
  Header, 
  Home, 
  Product, 
  ProductDetails, 
  Sidebar, 
  MarketingPromo,
  CartDetails,
  CategoryPage,
  Pagination,
  usePagination,
  PaginatedList,
  Button,
  Input,
  // Admin Components
  AdminLogin,
  AdminLayout,
  Dashboard,
  Products,
  Orders,
  Customers,
  StorageManager,
  ProtectedRoute,
  // Layout Components
  FrontendLayout
};

