import React, { createContext, useContext, useEffect, useState } from 'react';
import WishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext();

// Add the useWishlist hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Load user's wishlist when user changes
  useEffect(() => {
    console.log('WishlistContext: currentUser changed:', currentUser?.uid || 'null');
    if (currentUser) {
      loadWishlist();
    } else {
      console.log('WishlistContext: Clearing wishlist state');
      setWishlist([]);
      setWishlistCount(0);
      // Force immediate count update
      console.log('WishlistContext: Forced wishlist count to 0');
    }
  }, [currentUser?.uid]); // Use currentUser.uid instead of currentUser object

  const loadWishlist = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userWishlist = await WishlistService.getUserWishlist(currentUser.uid);
      setWishlist(userWishlist);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update wishlist count when wishlist changes
  useEffect(() => {
    const newCount = wishlist.length;
    console.log('WishlistContext: Updating wishlist count from', wishlistCount, 'to', newCount);
    setWishlistCount(newCount);
  }, [wishlist]);

  const addToWishlist = async (productId, productData) => {
    if (!currentUser) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      const updatedWishlist = await WishlistService.addToWishlist(currentUser.uid, productId, productData);
      setWishlist(updatedWishlist);
      return updatedWishlist;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;

    try {
      const updatedWishlist = await WishlistService.removeFromWishlist(currentUser.uid, productId);
      setWishlist(updatedWishlist);
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
      const updatedWishlist = await WishlistService.clearWishlist(currentUser.uid);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      wishlistCount, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      clearWishlist,
      loading,
      loadWishlist,
      refreshWishlist: loadWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext; 