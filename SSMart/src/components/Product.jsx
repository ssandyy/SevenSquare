import React, { useState, useContext } from "react";
import Button from "./parts/Button";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { getDiscountedPrice } from '../contexts/CartContext';
import { Eye, ShoppingCart, Star, Truck, Shield } from "lucide-react";
import WishlistButton from "./WishlistButton";

const Product = ({ product, cardClassName = "", containerClassName = "" }) => {  
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity } = useContext(CartContext);

  if (!Array.isArray(product)) {
    return <div>No products found.</div>;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${containerClassName}`}>
      {product.map((productz) => {
        const cartItem = cart.find((item) => item.id === productz.id);
        const inCart = !!cartItem;
        const { offerPrice, originalPrice, discountPercent } = getDiscountedPrice(productz.price);
        
        return (
          <div
            key={productz.id}
            className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${cardClassName}`}
          >
            {/* Product Image Container */}
            <div className="relative overflow-hidden bg-gray-50">
              <img
                className="w-full h-64 object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  src={productz.image}
                  alt={productz.title}
                />
              
              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  -{discountPercent}%
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full z-10">
                  {productz.category}
              </div>
              
              {/* Quick Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <WishlistButton 
                  productId={productz.id} 
                  productData={productz}
                  className="w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-colors"
                  showWhenInWishlist={true}
                />
                <button 
                  className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => navigate(`/product/${productz.id}`)}
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Stock Badge */}
              {productz.quantity <= 5 && (
                <div className="absolute bottom-3 left-3 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                  Only {productz.quantity} left
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
                  onClick={() => navigate(`/product/${productz.id}`)}>
                {productz.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                      className={`w-4 h-4 ${i <= Math.round(productz.rating.rate) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600 ml-1">
                  ({productz.rating.count})
                    </span>
                  </div>
                
              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-gray-900">
                    ${offerPrice}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ${originalPrice}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                      Save ${(originalPrice - offerPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>1 year warranty</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-2">
                  {!inCart ? (
                    <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      onClick={() => addToCart(productz)}
                    >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                    </button>
                  ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                        onClick={() => decrementQuantity(productz)}
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg w-12 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        className="w-8 h-8 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                        onClick={() => incrementQuantity(productz)}
                      >
                        +
                      </button>
                    </div>
                      <button
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                        onClick={() => removeFromCart(productz.id)}
                      >
                      Remove from Cart
                      </button>
                  </div>
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Product;
