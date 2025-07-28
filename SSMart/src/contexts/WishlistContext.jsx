import React, { createContext, useContext, useState, useEffect } from 'react';
import WishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  // Load user's wishlist when user changes
  useEffect(() => {
    if (currentUser) {
      loadWishlist();
    } else {
      setWishlist([]);
      setWishlistCount(0);
    }
  }, [currentUser]);

  const loadWishlist = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userWishlist = await WishlistService.getUserWishlist(currentUser.uid);
      setWishlist(userWishlist);
      setWishlistCount(userWishlist.length);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId, productData) => {
    if (!currentUser) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      console.log('Adding to wishlist - Current count:', wishlistCount);
      const newItem = await WishlistService.addToWishlist(currentUser.uid, productId, productData);
      setWishlist(prev => [newItem, ...prev]);
      setWishlistCount(prev => {
        const newCount = prev + 1;
        console.log('Updated wishlist count:', newCount);
        return newCount;
      });
      return newItem;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;

    try {
      console.log('Removing from wishlist - Current count:', wishlistCount);
      await WishlistService.removeFromWishlist(currentUser.uid, productId);
      setWishlist(prev => prev.filter(item => item.productId !== productId));
      setWishlistCount(prev => {
        const newCount = prev - 1;
        console.log('Updated wishlist count:', newCount);
        return newCount;
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = async (productId) => {
    if (!currentUser) return false;

    try {
      return await WishlistService.isInWishlist(currentUser.uid, productId);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  };

  const clearWishlist = async () => {
    if (!currentUser) return;

    try {
      await WishlistService.clearWishlist(currentUser.uid);
      setWishlist([]);
      setWishlistCount(0);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  };

  const moveToCart = async (productId) => {
    if (!currentUser) return;

    try {
      // Find the wishlist item to get product data
      const wishlistItem = wishlist.find(item => item.productId === productId);
      if (!wishlistItem) {
        throw new Error('Product not found in wishlist');
      }

      console.log('Moving to cart:', { productId, productData: wishlistItem.productData });

      // Add to cart first
      addToCart(wishlistItem.productData);
      
      // Then remove from wishlist
      await WishlistService.removeFromWishlist(currentUser.uid, productId);
      setWishlist(prev => prev.filter(item => item.productId !== productId));
      setWishlistCount(prev => prev - 1);
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    }
  };

  const value = {
    wishlist,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart,
    loadWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext; 