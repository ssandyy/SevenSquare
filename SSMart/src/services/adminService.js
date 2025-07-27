import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Dummy image URLs to avoid Firebase Storage costs
const DUMMY_IMAGES = {
  products: [
    'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Product+1',
    'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Product+2',
    'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Product+3',
    'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Product+4',
    'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Product+5',
    'https://via.placeholder.com/300x300/06B6D4/FFFFFF?text=Product+6',
    'https://via.placeholder.com/300x300/84CC16/FFFFFF?text=Product+7',
    'https://via.placeholder.com/300x300/F97316/FFFFFF?text=Product+8'
  ],
  customers: [
    'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=JD',
    'https://via.placeholder.com/100x100/10B981/FFFFFF?text=JS',
    'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=BJ',
    'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=AB',
    'https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=MC',
    'https://via.placeholder.com/100x100/06B6D4/FFFFFF?text=DL'
  ]
};

// Helper function to get random dummy image
const getRandomImage = (type) => {
  const images = DUMMY_IMAGES[type] || DUMMY_IMAGES.products;
  return images[Math.floor(Math.random() * images.length)];
};

// Products Service
export const productsService = {
  // Get all products
  async getAllProducts() {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data(),
          image: doc.data().image || getRandomImage('products')
        });
      });
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id) {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          image: docSnap.data().image || getRandomImage('products')
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Add new product
  async addProduct(productData) {
    try {
      const productWithDefaults = {
        ...productData,
        image: productData.image || getRandomImage('products'),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: productData.status || 'active',
        stock: parseInt(productData.stock) || 0,
        price: parseFloat(productData.price) || 0
      };
      
      const docRef = await addDoc(collection(db, 'products'), productWithDefaults);
      return { id: docRef.id, ...productWithDefaults };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id, productData) {
    try {
      const docRef = doc(db, 'products', id);
      const updateData = {
        ...productData,
        updatedAt: serverTimestamp()
      };
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      await deleteDoc(doc(db, 'products', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchTerm) {
    try {
      const q = query(
        collection(db, 'products'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data(),
          image: doc.data().image || getRandomImage('products')
        });
      });
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

// Orders Service
export const ordersService = {
  // Get all orders
  async getAllOrders() {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(id) {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Add new order
  async addOrder(orderData) {
    try {
      const orderWithDefaults = {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: orderData.status || 'pending',
        orderNumber: `ORD-${Date.now()}`,
        total: parseFloat(orderData.total) || 0
      };
      
      const docRef = await addDoc(collection(db, 'orders'), orderWithDefaults);
      return { id: docRef.id, ...orderWithDefaults };
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(id, status) {
    try {
      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return { id, status };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(id) {
    try {
      await deleteDoc(doc(db, 'orders', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};

// Customers Service
export const customersService = {
  // Get all customers
  async getAllCustomers() {
    try {
      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const customers = [];
      querySnapshot.forEach((doc) => {
        customers.push({
          id: doc.id,
          ...doc.data(),
          avatar: doc.data().avatar || getRandomImage('customers')
        });
      });
      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer by ID
  async getCustomerById(id) {
    try {
      const docRef = doc(db, 'customers', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          avatar: docSnap.data().avatar || getRandomImage('customers')
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Add new customer
  async addCustomer(customerData) {
    try {
      const customerWithDefaults = {
        ...customerData,
        avatar: customerData.avatar || getRandomImage('customers'),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: customerData.status || 'active',
        totalOrders: 0,
        totalSpent: 0
      };
      
      const docRef = await addDoc(collection(db, 'customers'), customerWithDefaults);
      return { id: docRef.id, ...customerWithDefaults };
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  // Update customer
  async updateCustomer(id, customerData) {
    try {
      const docRef = doc(db, 'customers', id);
      const updateData = {
        ...customerData,
        updatedAt: serverTimestamp()
      };
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  async deleteCustomer(id) {
    try {
      await deleteDoc(doc(db, 'customers', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
};

// Analytics Service
export const analyticsService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const [productsSnapshot, ordersSnapshot, customersSnapshot] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'customers'))
      ]);

      const totalProducts = productsSnapshot.size;
      const totalOrders = ordersSnapshot.size;
      const totalCustomers = customersSnapshot.size;

      // Calculate total revenue from completed orders
      let totalRevenue = 0;
      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        if (order.status === 'completed') {
          totalRevenue += parseFloat(order.total) || 0;
        }
      });

      return {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activity
  async getRecentActivity() {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const activities = [];
      
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        activities.push({
          id: doc.id,
          type: 'order',
          message: `New order #${order.orderNumber} received`,
          timestamp: order.createdAt,
          status: order.status
        });
      });

      return activities;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
};

// Initialize sample data
export const initializeSampleData = async () => {
  try {
    // Check if data already exists
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (!productsSnapshot.empty) {
      console.log('Sample data already exists');
      return;
    }

    console.log('Initializing sample data...');

    // Sample products
    const sampleProducts = [
      {
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        price: 999,
        stock: 25,
        description: 'Latest iPhone with advanced features and titanium design',
        status: 'active'
      },
      {
        name: 'Samsung Galaxy S24',
        category: 'Electronics',
        price: 899,
        stock: 15,
        description: 'Premium Android smartphone with AI features',
        status: 'active'
      },
      {
        name: 'MacBook Pro M3',
        category: 'Computers',
        price: 1999,
        stock: 8,
        description: 'Powerful laptop for professionals with M3 chip',
        status: 'active'
      },
      {
        name: 'Nike Air Max',
        category: 'Shoes',
        price: 129,
        stock: 50,
        description: 'Comfortable running shoes with air cushioning',
        status: 'active'
      },
      {
        name: 'iPad Pro',
        category: 'Electronics',
        price: 799,
        stock: 12,
        description: 'Professional tablet for creative work',
        status: 'active'
      }
    ];

    // Sample customers
    const sampleCustomers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001',
        status: 'active'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 234-5678',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        status: 'active'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 (555) 345-6789',
        address: '789 Pine Rd, Chicago, IL 60601',
        status: 'active'
      }
    ];

    // Add sample products
    for (const product of sampleProducts) {
      await productsService.addProduct(product);
    }

    // Add sample customers
    for (const customer of sampleCustomers) {
      await customersService.addCustomer(customer);
    }

    // Add sample orders
    const sampleOrders = [
      {
        customerId: 'sample-customer-1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          { name: 'iPhone 15 Pro', quantity: 1, price: 999 }
        ],
        total: 999,
        status: 'completed',
        shippingAddress: '123 Main St, New York, NY 10001'
      },
      {
        customerId: 'sample-customer-2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        items: [
          { name: 'MacBook Pro M3', quantity: 1, price: 1999 }
        ],
        total: 1999,
        status: 'shipped',
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
      }
    ];

    for (const order of sampleOrders) {
      await ordersService.addOrder(order);
    }

    console.log('Sample data initialized successfully!');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}; 