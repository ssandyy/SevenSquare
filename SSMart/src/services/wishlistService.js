import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export class WishlistService {
  // Get user's wishlist
  static async getUserWishlist(userId) {
    try {
      const userWishlistDoc = await getDoc(doc(db, 'wishlists', userId));
      if (userWishlistDoc.exists()) {
        return userWishlistDoc.data().items || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting user wishlist:', error);
      throw error;
    }
  }

  // Add product to wishlist
  static async addToWishlist(userId, productId, productData) {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      const userWishlistDoc = await getDoc(userWishlistRef);
      
      if (userWishlistDoc.exists()) {
        const currentWishlist = userWishlistDoc.data().items || [];
        const existingItem = currentWishlist.find(item => item.productId === productId);
        
        if (existingItem) {
          throw new Error('Product already in wishlist');
        } else {
          // Add new item
          const newItem = {
            productId,
            productData,
            addedAt: new Date().toISOString()
          };
          const updatedWishlist = [...currentWishlist, newItem];
          
          await updateDoc(userWishlistRef, { 
            items: updatedWishlist,
            updatedAt: new Date().toISOString()
          });
          
          return updatedWishlist;
        }
      } else {
        // Create new wishlist
        const newItem = {
          productId,
          productData,
          addedAt: new Date().toISOString()
        };
        
        await setDoc(userWishlistRef, { 
          userId,
          items: [newItem],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return [newItem];
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  // Remove product from wishlist
  static async removeFromWishlist(userId, productId) {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      const userWishlistDoc = await getDoc(userWishlistRef);
      
      if (userWishlistDoc.exists()) {
        const currentWishlist = userWishlistDoc.data().items || [];
        const updatedWishlist = currentWishlist.filter(item => item.productId !== productId);
        
        await updateDoc(userWishlistRef, { 
          items: updatedWishlist,
          updatedAt: new Date().toISOString()
        });
        
        return updatedWishlist;
      }
      return [];
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // Check if product is in user's wishlist
  static async isInWishlist(userId, productId) {
    try {
      const userWishlist = await this.getUserWishlist(userId);
      return userWishlist.some(item => item.productId === productId);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }

  // Get wishlist count for user
  static async getWishlistCount(userId) {
    try {
      const userWishlist = await this.getUserWishlist(userId);
      return userWishlist.length;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }

  // Clear user's entire wishlist
  static async clearWishlist(userId) {
    try {
      const userWishlistRef = doc(db, 'wishlists', userId);
      await updateDoc(userWishlistRef, { 
        items: [],
        updatedAt: new Date().toISOString()
      });
      return [];
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }
}

export default WishlistService; 