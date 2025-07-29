import React, { useState, useEffect, memo, useCallback } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Trash2, ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductImage } from '../utils/imageStorage';

const Wishlist = memo(() => {
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist, refreshWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const [removingItem, setRemovingItem] = useState(null);
  const [movingToCart, setMovingToCart] = useState(null);
  const [clearingWishlist, setClearingWishlist] = useState(false);

  // Refresh wishlist when component mounts
  useEffect(() => {
    if (currentUser) {
      refreshWishlist();
    }
  }, [currentUser?.uid, refreshWishlist]); // Use currentUser.uid instead of currentUser

  const handleRemoveFromWishlist = useCallback(async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setRemovingItem(productId);
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingItem(null);
    }
  }, [removeFromWishlist]);

  const handleMoveToCart = useCallback(async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setMovingToCart(productId);
      await moveToCart(productId);
    } catch (error) {
      console.error('Error moving to cart:', error);
    } finally {
      setMovingToCart(null);
    }
  }, [moveToCart]);

  const handleClearWishlist = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        setClearingWishlist(true);
        await clearWishlist();
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      } finally {
        setClearingWishlist(false);
      }
    }
  }, [clearWishlist]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Please sign in</h3>
          <p className="mt-1 text-sm text-gray-500">You need to be signed in to view your wishlist.</p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding items to your wishlist to see them here.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-2 text-gray-600">
            You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-square">
                <img
                  src={getProductImage(item.productId, item.productData?.image)}
                  alt={item.productData?.title || item.productData?.name || 'Product'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleRemoveFromWishlist(item.productId, e)}
                    disabled={removingItem === item.productId}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {removingItem === item.productId ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <Heart className="h-6 w-6 text-red-500 fill-current" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.productData?.title || item.productData?.name || 'Product Name'}
                </h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (item.productData?.rating?.rate || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    ({item.productData?.rating?.rate || 0})
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.productData?.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold ml-2">₹{item.productData?.price || 0}</span>
                  <span className="text-sm text-gray-500">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleMoveToCart(item.productId, e)}
                    disabled={movingToCart === item.productId}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {movingToCart === item.productId ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    {movingToCart === item.productId ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <Link
                    to={`/product/${item.productId}`}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Wishlist Button */}
        {wishlist.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleClearWishlist}
              disabled={clearingWishlist}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {clearingWishlist ? (
                <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {clearingWishlist ? 'Clearing...' : 'Clear Wishlist'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default Wishlist; 