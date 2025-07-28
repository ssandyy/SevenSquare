import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  getDoc,
  setDoc 
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export class WishlistService {
  // Add product to wishlist
  static async addToWishlist(userId, productId, productData) {
    try {
      console.log('WishlistService: Adding to wishlist', { userId, productId });
      
      // Check if product already exists in wishlist
      const existingQuery = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        where('productId', '==', productId)
      );
      
      const existingDocs = await getDocs(existingQuery);
      
      if (!existingDocs.empty) {
        console.log('WishlistService: Product already in wishlist');
        throw new Error('Product already in wishlist');
      }

      // Add to wishlist
      const wishlistItem = {
        userId,
        productId,
        productData,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('WishlistService: Creating wishlist item', wishlistItem);
      const docRef = await addDoc(collection(db, 'wishlists'), wishlistItem);
      
      const result = {
        id: docRef.id,
        ...wishlistItem
      };
      
      console.log('WishlistService: Successfully added to wishlist', result);
      return result;
    } catch (error) {
      console.error('WishlistService: Error adding to wishlist:', error);
      throw error;
    }
  }

  // Remove product from wishlist
  static async removeFromWishlist(userId, productId) {
    try {
      const wishlistQuery = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        where('productId', '==', productId)
      );
      
      const wishlistDocs = await getDocs(wishlistQuery);
      
      if (wishlistDocs.empty) {
        throw new Error('Product not found in wishlist');
      }

      // Delete the wishlist item
      const wishlistItem = wishlistDocs.docs[0];
      await deleteDoc(doc(db, 'wishlists', wishlistItem.id));
      
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  // Get user's wishlist
  static async getUserWishlist(userId) {
    try {
      console.log('WishlistService: Getting wishlist for user', userId);
      
      const wishlistQuery = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        orderBy('addedAt', 'desc')
      );
      
      const wishlistDocs = await getDocs(wishlistQuery);
      
      const result = wishlistDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('WishlistService: Retrieved wishlist items', result);
      return result;
    } catch (error) {
      console.error('WishlistService: Error getting user wishlist:', error);
      throw error;
    }
  }

  // Check if product is in user's wishlist
  static async isInWishlist(userId, productId) {
    try {
      const wishlistQuery = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId),
        where('productId', '==', productId)
      );
      
      const wishlistDocs = await getDocs(wishlistQuery);
      
      return !wishlistDocs.empty;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }

  // Get wishlist count for user
  static async getWishlistCount(userId) {
    try {
      const wishlistQuery = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId)
      );
      
      const wishlistDocs = await getDocs(wishlistQuery);
      
      return wishlistDocs.size;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }

  // Clear user's entire wishlist
  static async clearWishlist(userId) {
    try {
      const wishlistQuery = query(
        collection(db, 'wishlists'),
        where('userId', '==', userId)
      );
      
      const wishlistDocs = await getDocs(wishlistQuery);
      
      const deletePromises = wishlistDocs.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      
      return { success: true, deletedCount: wishlistDocs.size };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }

  // Move wishlist item to cart (optional feature)
  static async moveToCart(userId, productId) {
    try {
      // First remove from wishlist
      await this.removeFromWishlist(userId, productId);
      
      // Then add to cart (you would implement cart service separately)
      // For now, just return success
      return { success: true, message: 'Moved to cart' };
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    }
  }
}

export default WishlistService; 