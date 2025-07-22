import React, { useState } from 'react';
import { Star, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import CartContext from '../contexts/CartContext';



const ProductDetails = ({t}) => {

  const {id} = useParams();
  const {products} = useContext(ProductContext);
  const product = products.find((p) => String(p.id) === id);
  console.log(product);
  const {addToCart, removeFromCart, incrementQuantity, decrementQuantity, cart} = useContext(CartContext);


  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 1;

  
  // const {name, title, price, description, category,rating, image} = 

  const [selectedColor, setSelectedColor] = useState(1);
  const [selectedSize, setSelectedSize] = useState(1);
  const colors = ['#27AE60', '#EB5757', '#F2C94C', '#2F80ED', '#000000'];
  const sizes = [16, 20, 28, 28, 28];

  if (!product) {
    return <div>Product not found</div>;
  }
  
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl border shadow-md grid md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-indigo-600 font-medium">
          Travel / {product.category}
        </div>

        {/* Title & Wishlist */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-semibold leading-tight">
          {product.title}
          </h1>
          <button className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100">
            <Heart className="text-indigo-500" size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm">
          {product.description}
        </p>

        {/* Price & Discount */}
        <div className="flex items-center gap-4 text-lg font-semibold">
          <span className="text-black">{product.price}</span>
          <span className="line-through text-gray-400 text-base">$100.00</span>
          <span className="text-indigo-600 text-sm">20% off</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          {[...Array(4)].map((_, i) => (
            <Star key={i} size={18} fill="#FBBF24" stroke="#FBBF24" />
          ))}
          <Star size={18} stroke="#FBBF24" />
          <span className="text-sm text-gray-600 ml-2">1624 reviews</span>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 mt-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className={`w-16 h-16 rounded-xl overflow-hidden border ${i === 1 ? 'border-indigo-500' : 'border-gray-200'}`}
            >
              <img
                src={product.image}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        {/* Main Image */}
        <div className="rounded-xl overflow-hidden w-full aspect-square bg-gray-100">
          <img
            src={product.image}
            alt="Product"
            className="w-full h-full object-fit"
          />
        </div>

        {/* Bag Color */}
        <div>
          <h4 className="text-sm font-medium mb-2">Bag Color</h4>
          <div className="flex gap-3">
            {colors.map((color, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(i)}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === i ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Bag Size */}
        <div>
          <h4 className="text-sm font-medium mb-2 mt-2">Bag Size</h4>
          <div className="flex gap-3">
            {sizes.map((size, i) => (
              <button
                key={i}
                onClick={() => setSelectedSize(i)}
                className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border ${
                  selectedSize === i
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-black border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-3 mt-2">
        <h4 className="text-sm font-medium mb-2 mt-2">Quantity: </h4>
          <button
            onClick={() => decrementQuantity(product)}
            className="w-10 h-10 border rounded-full flex items-center justify-center text-xl"
          >
            −
          </button>
          <span className="w-8 text-center text-base">{quantity}</span>
          {console.log(quantity)}
          <button
            onClick={() => incrementQuantity(product.quantity)}
            className="w-10 h-10 border rounded-full flex items-center justify-center text-xl"
          >
            +
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button 
          onClick={() => addToCart(product)}
           className="flex-1 bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-full hover:bg-indigo-200 transition">
            Add To Cart
          </button>
          <button className="flex-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-full hover:bg-indigo-700 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
