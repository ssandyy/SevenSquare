import express from 'express';
import { adminLogin } from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }
    
    const admin = adminLogin(username, password);
    
    if (admin) {
      res.json({
        success: true,
        token: 'admin-token',
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        },
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Admin Logout
router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Logout failed' 
    });
  }
});

// Verify admin token
router.get('/verify', (req, res) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }
    
    const token = authorization.split(' ')[1];
    
    if (token === 'admin-token') {
      res.json({
        success: true,
        valid: true,
        message: 'Token is valid'
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Token verification failed' 
    });
  }
});

export default router; 