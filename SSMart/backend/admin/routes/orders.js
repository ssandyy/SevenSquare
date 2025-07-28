import express from 'express';

const router = express.Router();

// In-memory storage for orders (replace with database in production)
let orders = [];
let nextId = 1;

// Get all orders
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let filteredOrders = orders;
    
    // Apply status filter
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    // Apply search filter
    if (search) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort by latest first
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredOrders.length / limitNum),
        totalOrders: filteredOrders.length,
        hasNextPage: endIndex < filteredOrders.length,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', (req, res) => {
  try {
    const { customerId, customerName, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    const orderData = {
      id: nextId.toString(),
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerId,
      customerName,
      items: items || [],
      totalAmount: parseFloat(totalAmount),
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(orderData);
    nextId++;

    res.status(201).json({
      success: true,
      order: orderData,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

// Update order status
router.put('/:id/status', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      order: orders[orderIndex],
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

// Delete order
router.delete('/:id', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    orders.splice(orderIndex, 1);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete order' });
  }
});

// Get order statistics
router.get('/stats/overview', (req, res) => {
  try {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Orders this month
    const now = new Date();
    const ordersThisMonth = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === now.getMonth() && 
             orderDate.getFullYear() === now.getFullYear();
    }).length;

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        ordersThisMonth
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch order statistics' });
  }
});

export default router; 