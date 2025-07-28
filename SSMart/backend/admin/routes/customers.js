import express from 'express';

const router = express.Router();

// In-memory storage for customers (replace with database in production)
let customers = [];
let nextId = 1;

// Get all customers
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let filteredCustomers = customers;
    
    // Apply search filter
    if (search) {
      filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      customers: paginatedCustomers,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredCustomers.length / limitNum),
        totalCustomers: filteredCustomers.length,
        hasNextPage: endIndex < filteredCustomers.length,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch customers' });
  }
});

// Get single customer
router.get('/:id', (req, res) => {
  try {
    const customer = customers.find(c => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch customer' });
  }
});

// Create new customer
router.post('/', (req, res) => {
  try {
    const { name, email, phone, address, status } = req.body;
    
    // Check if email already exists
    const existingCustomer = customers.find(c => c.email === email);
    if (existingCustomer) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    const customerData = {
      id: nextId.toString(),
      name,
      email,
      phone,
      address,
      status: status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0
    };

    customers.push(customerData);
    nextId++;

    res.status(201).json({
      success: true,
      customer: customerData,
      message: 'Customer created successfully'
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ success: false, error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', (req, res) => {
  try {
    const customerIndex = customers.findIndex(c => c.id === req.params.id);
    if (customerIndex === -1) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    const { name, email, phone, address, status } = req.body;
    
    // Check if email already exists (excluding current customer)
    const existingCustomer = customers.find(c => c.email === email && c.id !== req.params.id);
    if (existingCustomer) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    const updatedCustomer = {
      ...customers[customerIndex],
      name,
      email,
      phone,
      address,
      status: status || 'active',
      updatedAt: new Date().toISOString()
    };

    customers[customerIndex] = updatedCustomer;

    res.json({
      success: true,
      customer: updatedCustomer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ success: false, error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', (req, res) => {
  try {
    const customerIndex = customers.findIndex(c => c.id === req.params.id);
    if (customerIndex === -1) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    customers.splice(customerIndex, 1);

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete customer' });
  }
});

// Get customer statistics
router.get('/stats/overview', (req, res) => {
  try {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const newCustomersThisMonth = customers.filter(c => {
      const createdAt = new Date(c.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && 
             createdAt.getFullYear() === now.getFullYear();
    }).length;

    res.json({
      success: true,
      stats: {
        totalCustomers,
        activeCustomers,
        newCustomersThisMonth
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch customer statistics' });
  }
});

export default router; 