// Admin Authentication Middleware
export const authenticateAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  
  const token = authorization.split(' ')[1];
  
  // In production, verify JWT token
  // For now, simple check
  if (token === 'admin-token') {
    next();
  } else {
    res.status(401).json({ error: 'Invalid admin token' });
  }
};

// Admin users (in production, this would be in a database)
export const adminUsers = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123', // In production, use hashed passwords
    email: 'admin@ssmart.com',
    role: 'admin'
  }
];

// Admin login function
export const adminLogin = (username, password) => {
  return adminUsers.find(a => a.username === username && a.password === password);
}; 

