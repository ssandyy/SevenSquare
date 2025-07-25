import React, { useState, useContext } from "react";
import Button from "./parts/Button";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { getDiscountedPrice } from '../contexts/CartContext';

const Product = ({ product,  cardClassName = "", containerClassName = "" }) => {  
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity } = useContext(CartContext);

  if (!Array.isArray(product)) {
    return <div>No products found.</div>;
  }

  return (
    <div className={` ${containerClassName}`}>
      {product.map((productz) => {
        const cartItem = cart.find((item) => item.id === productz.id);
        const inCart = !!cartItem;
        const { offerPrice, originalPrice, discountPercent } = getDiscountedPrice(productz.price);
        return (
          <div
            key={productz.id}
            className={`group relative mt-10 w-[320px] max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 ${cardClassName}`}
          >
            <div className="absolute top-5 -right-10 group-hover:right-5 z-20 flex flex-col items-center justify-center gap-y-2 opacity-0 group-hover:opacity-100 transition-all">
              {/* Wishlist Button */}
              <Button
                style="bg-red-400 hover:bg-red-600"
                onClick={() => navigate(`/wishlist/${productz.id}`)}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </Button>
              <Button
                style="bg-green-400 hover:bg-green-600"
                type="button"
                as="a"
                onClick={() => navigate(`/product/${productz.id}`)} 
                title="View Details"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1.5 12C3.5 7 8 4 12 4s8.5 3 10.5 8c-2 5-6.5 8-10.5 8s-8.5-3-10.5-8z"
                  />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[300px] overflow-hidden rounded-t-2xl">
                <img
                  className="p-4 w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  src={productz.image}
                  alt={productz.title}
                />
                {/* Example badge */}
                <span className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  {productz.category}
                </span>
                
              </div>
              
              <div className="px-4 pb-4 w-full flex flex-col gap-2">
                {/* Title below */}
                <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white mb-2 text-left">
                  {productz.title.length > 20
                    ? productz.title.substring(0, 20) + "..."
                    : productz.title}
                </h5>

                <div className="flex items-center space-x-1" title={`Rating: ${productz.rating.rate}`}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i <= Math.round(productz.rating.rate) ? "text-yellow-400" : "text-gray-300"}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded px-2 py-0.5 dark:bg-blue-200 dark:text-blue-800">
                      {productz.rating.rate}
                    </span>
                  </div>
                
                {/* Price and Rating side by side */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${offerPrice}
                  </span>
                  <span className="line-through text-gray-400 text-base">${originalPrice}</span>
                  <span className="text-indigo-600 text-sm">{discountPercent}% off</span>
                  
                  <span className=" bg-purple-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                  only {productz.quantity} left
                </span>
                </div>
                {/* Add/Remove/Quantity controls side by side */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  {!inCart ? (
                    <button
                      className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                      onClick={() => addToCart(productz)}
                    >
                      <svg
                        className="w-5 h-5 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L19 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7"
                        />
                      </svg>
                      Add to cart
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-gray-200 text-gray-700 rounded px-2 py-1 hover:bg-gray-300"
                        onClick={() => decrementQuantity(productz)}
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg w-8 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        className="bg-gray-200 text-gray-700 rounded px-2 py-1 hover:bg-gray-300"
                        onClick={() => incrementQuantity(productz)}
                      >
                        +
                      </button>
                      <button
                        className="ml-2 text-xs text-white bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 rounded px-3 py-1"
                        onClick={() => removeFromCart(productz.id)}
                      >
                        Remove
                      </button>
                      
                    </>
                  )}
                  
                </div>
                
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Product;
