import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDo2XY9ivKQpgJGtO7m93ykrgYEdz71cgc",
    authDomain: "ecommerce-react-ssmart.firebaseapp.com",
    projectId: "ecommerce-react-ssmart",
    storageBucket: "ecommerce-react-ssmart.firebasestorage.app",
    messagingSenderId: "465600198228",
    appId: "1:465600198228:web:222b0b1db844926ffedfc1",
    measurementId: "G-HC6FXW4ZQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Products Service
export const productsService = {
  async getAllProducts() {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(id, productData) {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
      return { id, ...productData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      await deleteDoc(doc(db, 'products', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Analytics Service
export const analyticsService = {
  async getDashboardStats() {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => doc.data());
      
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === 'active').length;
      const lowStockProducts = products.filter(p => p.stock < 10).length;
      const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

      return {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalRevenue: Math.round(totalValue * 100) / 100,
        totalOrders: 0, // Placeholder for now
        totalCustomers: 0 // Placeholder for now
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if there's an error
      return {
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0
      };
    }
  },

  async getRecentActivity() {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.slice(0, 5).map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return products.map(product => ({
        type: 'product',
        id: product.id,
        title: `Product: ${product.name}`,
        description: `Added ${product.name} - $${product.price}`,
        timestamp: product.createdAt,
        status: product.status
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
};

// Initialize sample data
export const initializeSampleData = async () => {
  try {
    const sampleProducts = [
      {
        name: 'Sample Product 1',
        category: 'Electronics',
        price: 99.99,
        stock: 50,
        description: 'This is a sample product description.',
        status: 'active'
      },
      {
        name: 'Sample Product 2',
        category: 'Clothing',
        price: 29.99,
        stock: 100,
        description: 'Another sample product for testing.',
        status: 'active'
      }
    ];

    for (const product of sampleProducts) {
      await productsService.addProduct(product);
    }

    return { success: true, message: 'Sample data initialized' };
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
}; 

export default { productsService, analyticsService, initializeSampleData };