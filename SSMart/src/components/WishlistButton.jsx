import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

const WishlistButton = ({ productId, productData, className = '', showWhenInWishlist = false, tooltip }) => {
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToWishlist, removeFromWishlist, wishlist, isInWishlist, refreshWishlist } = useWishlist();
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
  }, [currentUser?.uid, productId, wishlist, isInWishlist]);

  const handleWishlistToggle = async () => {
    if (!currentUser) {
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
      await refreshWishlist();
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
      className={`relative p-2 rounded-full transition-all duration-200 transform ${
        isInWishlistState ? 'bg-red-100' : 'bg-white'
      } ${loading ? 'animate-pulse' : ''} ${className} ${
        showWhenInWishlist && !isInWishlistState 
          ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-200' 
          : ''
      } ${isInWishlistState || loading ? '' : 'hover:scale-90'} group`}
      title={tooltip ? (isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist') : undefined}
      style={{ outline: 'none', border: 'none' }}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 ${
          isInWishlistState ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:fill-red-400 group-hover:text-red-400'
        } ${loading ? 'animate-pulse' : ''}`}
        fill={isInWishlistState ? 'currentColor' : 'none'}
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