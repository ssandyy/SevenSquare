import express from 'express';

const router = express.Router();

// In-memory storage (replace with database in production)
let products = [];
let customers = [];
let orders = [];

// Get dashboard overview statistics
router.get('/overview', (req, res) => {
  try {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Product statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalProductValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Customer statistics
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const newCustomersThisMonth = customers.filter(c => {
      const createdAt = new Date(c.createdAt);
      return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
    }).length;

    // Order statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const ordersThisMonth = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
    }).length;

    const revenueThisMonth = orders
      .filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === thisMonth && 
               orderDate.getFullYear() === thisYear && 
               o.status === 'delivered';
      })
      .reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      success: true,
      overview: {
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
          totalValue: Math.round(totalProductValue * 100) / 100
        },
        customers: {
          total: totalCustomers,
          active: activeCustomers,
          newThisMonth: newCustomersThisMonth
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          thisMonth: ordersThisMonth
        },
        revenue: {
          total: Math.round(totalRevenue * 100) / 100,
          thisMonth: Math.round(revenueThisMonth * 100) / 100
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard overview' });
  }
});

// Get recent activity
router.get('/recent-activity', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    // Combine recent activities from different sources
    const activities = [];

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limitNum)
      .map(order => ({
        type: 'order',
        id: order.id,
        title: `New order #${order.orderNumber}`,
        description: `Order from ${order.customerName} - $${order.totalAmount}`,
        timestamp: order.createdAt,
        status: order.status
      }));

    // Recent customers
    const recentCustomers = customers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limitNum)
      .map(customer => ({
        type: 'customer',
        id: customer.id,
        title: `New customer registered`,
        description: `${customer.name} (${customer.email})`,
        timestamp: customer.createdAt,
        status: customer.status
      }));

    // Recent products
    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limitNum)
      .map(product => ({
        type: 'product',
        id: product.id,
        title: `New product added`,
        description: `${product.name} - $${product.price}`,
        timestamp: product.createdAt,
        status: product.status
      }));

    // Combine and sort by timestamp
    activities.push(...recentOrders, ...recentCustomers, ...recentProducts);
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      activities: activities.slice(0, limitNum)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch recent activity' });
  }
});

// Get sales chart data
router.get('/sales-chart', (req, res) => {
  try {
    const { period = '7days' } = req.query;
    const now = new Date();
    const chartData = [];

    if (period === '7days') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr && o.status === 'delivered';
        });
        
        const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        chartData.push({
          date: dateStr,
          revenue: Math.round(dayRevenue * 100) / 100,
          orders: dayOrders.length
        });
      }
    } else if (period === '30days') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr && o.status === 'delivered';
        });
        
        const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        chartData.push({
          date: dateStr,
          revenue: Math.round(dayRevenue * 100) / 100,
          orders: dayOrders.length
        });
      }
    }

    res.json({
      success: true,
      chartData,
      period
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sales chart data' });
  }
});

// Get top products
router.get('/top-products', (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit);

    // Count product orders (simplified - in real app you'd track this properly)
    const productOrderCounts = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productOrderCounts[item.productId]) {
          productOrderCounts[item.productId]++;
        } else {
          productOrderCounts[item.productId] = 1;
        }
      });
    });

    const topProducts = products
      .map(product => ({
        ...product,
        orderCount: productOrderCounts[product.id] || 0
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, limitNum);

    res.json({
      success: true,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch top products' });
  }
});

export default router; 