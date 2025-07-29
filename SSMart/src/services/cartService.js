import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export class CartService {
  // Get user's cart
  static async getUserCart(userId) {
    try {
      const userCartDoc = await getDoc(doc(db, 'carts', userId));
      if (userCartDoc.exists()) {
        return userCartDoc.data().items || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting user cart:', error);
      throw error;
    }
  }

  // Add item to cart
  static async addToCart(userId, product) {
    try {
      const userCartRef = doc(db, 'carts', userId);
      const userCartDoc = await getDoc(userCartRef);
      
      if (userCartDoc.exists()) {
        const currentCart = userCartDoc.data().items || [];
        const existingItem = currentCart.find(item => item.id === product.id);
        
        if (existingItem) {
          // Update quantity if item exists
          const updatedCart = currentCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          
          await updateDoc(userCartRef, { items: updatedCart });
          return updatedCart;
        } else {
          // Add new item
          const newItem = { 
            ...product, 
            quantity: 1, 
            maxQuantity: product.quantity,
            addedAt: new Date().toISOString()
          };
          const updatedCart = [...currentCart, newItem];
          
          await updateDoc(userCartRef, { items: updatedCart });
          return updatedCart;
        }
      } else {
        // Create new cart
        const newItem = { 
          ...product, 
          quantity: 1, 
          maxQuantity: product.quantity,
          addedAt: new Date().toISOString()
        };
        
        await setDoc(userCartRef, { 
          userId,
          items: [newItem],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return [newItem];
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Remove item from cart
  static async removeFromCart(userId, productId) {
    try {
      const userCartRef = doc(db, 'carts', userId);
      const userCartDoc = await getDoc(userCartRef);
      
      if (userCartDoc.exists()) {
        const currentCart = userCartDoc.data().items || [];
        const updatedCart = currentCart.filter(item => item.id !== productId);
        
        await updateDoc(userCartRef, { 
          items: updatedCart,
          updatedAt: new Date().toISOString()
        });
        
        return updatedCart;
      }
      return [];
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Update item quantity
  static async updateQuantity(userId, productId, quantity) {
    try {
      const userCartRef = doc(db, 'carts', userId);
      const userCartDoc = await getDoc(userCartRef);
      
      if (userCartDoc.exists()) {
        const currentCart = userCartDoc.data().items || [];
        const updatedCart = currentCart.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0); // Remove items with 0 quantity
        
        await updateDoc(userCartRef, { 
          items: updatedCart,
          updatedAt: new Date().toISOString()
        });
        
        return updatedCart;
      }
      return [];
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  // Increment quantity
  static async incrementQuantity(userId, productId) {
    try {
      const userCartRef = doc(db, 'carts', userId);
      const userCartDoc = await getDoc(userCartRef);
      
      if (userCartDoc.exists()) {
        const currentCart = userCartDoc.data().items || [];
        const updatedCart = currentCart.map(item =>
          item.id === productId && item.quantity < item.maxQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        await updateDoc(userCartRef, { 
          items: updatedCart,
          updatedAt: new Date().toISOString()
        });
        
        return updatedCart;
      }
      return [];
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      throw error;
    }
  }

  // Decrement quantity
  static async decrementQuantity(userId, productId) {
    try {
      const userCartRef = doc(db, 'carts', userId);
      const userCartDoc = await getDoc(userCartRef);
      
      if (userCartDoc.exists()) {
        const currentCart = userCartDoc.data().items || [];
        const updatedCart = currentCart
          .map(item =>
            item.id === productId
              ? { ...item, quantity: Math.max(0, item.quantity - 1) }
              : item
          )
          .filter(item => item.quantity > 0); // Remove items with 0 quantity
        
        await updateDoc(userCartRef, { 
          items: updatedCart,
          updatedAt: new Date().toISOString()
        });
        
        return updatedCart;
      }
      return [];
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      throw error;
    }
  }

  // Clear cart
  static async clearCart(userId) {
    try {
      const userCartRef = doc(db, 'carts', userId);
      await updateDoc(userCartRef, { 
        items: [],
        updatedAt: new Date().toISOString()
      });
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Get cart statistics
  static async getCartStats(userId) {
    try {
      const cart = await this.getUserCart(userId);
      
      const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        totalQuantity,
        totalPrice: totalPrice.toFixed(2),
        itemCount: cart.length
      };
    } catch (error) {
      console.error('Error getting cart stats:', error);
      throw error;
    }
  }
}

export default CartService; 