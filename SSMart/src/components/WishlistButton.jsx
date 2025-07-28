import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

const WishlistButton = ({ productId, productData, className = '', showWhenInWishlist = false }) => {
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToWishlist, removeFromWishlist, wishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (currentUser && productId) {
        try {
          const inWishlist = await isInWishlist(productId);
          setIsInWishlistState(inWishlist);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      } else {
        setIsInWishlistState(false);
      }
    };

    checkWishlistStatus();
  }, [currentUser, productId, wishlist, isInWishlist]);

  const handleWishlistToggle = async () => {
    if (!currentUser) {
      // Redirect to login or show login modal
      alert('Please sign in to add items to your wishlist');
      return;
    }

    try {
      setLoading(true);
      
      if (isInWishlistState) {
        await removeFromWishlist(productId);
        setIsInWishlistState(false);
      } else {
        await addToWishlist(productId, productData);
        setIsInWishlistState(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine visibility based on wishlist state and showWhenInWishlist prop
  const isVisible = isInWishlistState || !showWhenInWishlist;

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={loading}
      className={`relative p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
        isInWishlistState
          ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
          : 'bg-white text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-300 shadow-md'
      } ${loading ? 'animate-pulse' : ''} ${className} ${
        showWhenInWishlist && !isInWishlistState 
          ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-200' 
          : ''
      }`}
      title={isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-300 ${
          isInWishlistState ? 'fill-current scale-110' : ''
        } ${loading ? 'animate-pulse' : ''}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};

export default WishlistButton; 