
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminLogin from "./Auth/AdminLogin";
import AdminSignup from "./Auth/AdminSignup";

const AdminDashboard = ({ onLogin, onSignup }) => {

  return (
    <div>
        <h1>Admin Dashboard</h1>
        <AdminLogin onLogin={onLogin} />
        <AdminSignup onSignup={onSignup} />
        
    </div>
  );
};

export default AdminDashboard;
