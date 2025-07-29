import React, { useState, useContext } from "react";
import Button from "./parts/Button";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { getDiscountedPrice } from '../contexts/CartContext';
import { Eye, ShoppingCart, Star, Truck, Shield, Trash, AlertTriangle, Heart as HeartIcon } from "lucide-react";
import WishlistButton from "./WishlistButton";
import Toast from "./Toast";
import defaultProductImage from "../img/product.svg";

const Product = ({ product, cardClassName = "", containerClassName = "" }) => {  
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity } = useContext(CartContext);

  const handleAddToCart = async (productz) => {
    try {
      await addToCart(productz);
      setToast({ message: 'Added to cart successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message.includes('Please login')) {
        setToast({ message: 'Please login to add items to cart', type: 'warning' });
      } else {
        setToast({ message: 'Error adding to cart', type: 'error' });
      }
    }
  };

  const handleIncrement = async (productz) => {
    try {
      await incrementQuantity(productz.id);
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const handleDecrement = async (productz) => {
    try {
      await decrementQuantity(productz.id);
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  if (!Array.isArray(product)) {
    return <div>No products found.</div>;
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ${containerClassName}`}>
      {product.map((productz) => {
        const cartItem = cart.find((item) => item.id === productz.id);
        const inCart = !!cartItem;
        const { offerPrice, originalPrice, discountPercent } = getDiscountedPrice(productz.price);
        const isLowStock = productz.quantity <= 5;
        return (
          <div
            key={productz.id}
            className={`group relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:border-blue-400 hover:scale-[1.025] transition-all duration-200 overflow-hidden ${cardClassName}`}
          >
            {/* Product Image */}
            <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl border-b border-gray-100 h-40 flex items-center justify-center p-3">
              {/* Category Badge (top-left inside image) */}
              <span
                className="absolute top-3 left-3 z-20 bg-blue-100 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full truncate max-w-[90px] cursor-pointer shadow"
                title={productz.category}
              >
                {productz.category}
              </span>
            
             
              <img
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
                src={productz.image || defaultProductImage}
                alt={productz.title}
                style={{ maxHeight: 140, minHeight: 100 }}
              />
              {/* Stock Badge */}
              {isLowStock && (
                <div className="absolute bottom-3 left-3 z-20 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <AlertTriangle className="w-3 h-3 mr-1 text-orange-500" />
                  Only {productz.quantity} left
                </div>
              )}
            </div>

            {/* Action Buttons (top-right of card, outside image) */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-30">
              {/* Wishlist Button */}
              <WishlistButton 
                productId={productz.id} 
                productData={productz}
                className="w-8 h-8 rounded-full shadow-lg border border-gray-200 bg-white/90 hover:bg-red-100 flex items-center justify-center transition-colors"
                showWhenInWishlist={true}
                tooltip
              />
              {/* View Details Button */}
              <button 
                className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-200"
                onClick={() => navigate(`/product/${productz.id}`)}
                title="View Details"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-3 flex flex-col gap-1">
              {/* Title */}
              <h3 
                className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer min-h-[2.2rem]"
                onClick={() => navigate(`/product/${productz.id}`)}
                title={productz.title}
              >
                {productz.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= Math.round(productz.rating.rate) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({productz.rating.count} reviews)
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">
                  {productz.rating.rate.toFixed(1)}
                </span>
              </div>

              {/* Price */}
              <div className="mb-2 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-green-700">
                    ₹{offerPrice}
                  </span>
                  {discountPercent > 0 && (
                    <>
                      <span className="text-xs text-gray-500 line-through">
                        ₹{originalPrice}
                      </span>
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow inline-block align-middle">
                        -{discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                {discountPercent > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      Save ₹{(originalPrice - offerPrice).toFixed(2)}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      ({discountPercent}% off)
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2 border-t border-gray-100 pt-2">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>1 year warranty</span>
                </div>
              </div>

              {/* Add to Cart Button / Quantity Controls */}
              <div>
                {!inCart ? (
                  <button
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-150 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm active:scale-95"
                    onClick={() => handleAddToCart(productz)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div style={{ flex: '1 1 60%' }} className="flex items-center justify-center bg-gray-50 rounded-lg p-1">
                      <button
                        className="w-8 h-8 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center shadow-sm border border-gray-200"
                        onClick={() => handleDecrement(productz)}
                      >
                        -
                      </button>
                      <span className="font-semibold text-base text-center mx-2" style={{ minWidth: '36px' }}>
                        {cartItem.quantity}
                      </span>
                      <button
                        className="w-8 h-8 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center shadow-sm border border-gray-200"
                        onClick={() => handleIncrement(productz)}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ flex: '1 1 40%' }} className="flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveFromCart(productz.id)}
                        title="Remove from Cart"
                        className="flex items-center justify-center transition-colors focus:outline-none w-8 h-8 rounded-full text-red-500 border border-red-300 bg-white hover:bg-red-50 shadow-sm sm:w-auto sm:h-auto sm:rounded-lg sm:px-3 sm:py-2 sm:bg-transparent sm:text-red-600 sm:hover:bg-red-100 text-sm"
                      >
                        <span className="inline sm:hidden">
                          <Trash className="w-4 h-4" />
                        </span>
                        <span className="hidden sm:inline font-medium text-sm">
                          Remove
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Product;