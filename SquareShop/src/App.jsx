import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminDasboard from './adminpanel/AdminDasboard';
import AdminProducts from './adminpanel/AdminProducts';
import ProductForm from './adminpanel/ProductForm';
import { Cart, Home } from './components';
import AuthLayout from "./components/AuthLayout";
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import EditProfile from './pages/Profile crud/EditProfile';
import Login from './pages/Profile crud/Login';
import Signup from './pages/Profile crud/Signup';
import UpdatePassword from './pages/Profile crud/UpdatePassword';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={
            <AuthLayout authentication>
              <h1 className="text-2xl text-center">My Profile</h1>
              <Profile />
            </AuthLayout>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit-profile" element={
            <AuthLayout authentication>
              <EditProfile />
            </AuthLayout>
          } />
          <Route path="/change-password" element={
            <AuthLayout authentication>
              <UpdatePassword />
            </AuthLayout>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDasboard />}>
            <Route index element={<div>Admin Dashboard</div>} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:productId" element={<ProductForm />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;