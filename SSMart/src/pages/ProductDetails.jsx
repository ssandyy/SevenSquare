import { HomeIcon, Star } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WishlistButton from '../components/WishlistButton';
import CartContext, { getDiscountedPrice } from '../contexts/CartContext';
import { ProductContext } from '../contexts/ProductContext';


const ProductDetails = ({ products: propProducts }) => {
  const { products: contextProducts } = useContext(ProductContext);
  const { id } = useParams();
  
  // Use prop products if provided, otherwise use context products
  const products = propProducts || contextProducts;
  const product = products.find((p) => String(p.id) === id);

  const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, cart} = useContext(CartContext);
  const cartItem = cart.find((item) => item.id === product?.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');

  console.log('Products:', products);
  console.log('Product:', product);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <div className="text-gray-500 text-lg">Product not found</div>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }
  
  // Use the utility for price/discount
  const { offerPrice, originalPrice, discountPercent } = getDiscountedPrice(product.price);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl border shadow-md grid md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
          <Link to="/"> <HomeIcon /> </Link> / 
          <Link to={`/category/${product.category}`} className="hover:underline">
            {product.category}
          </Link> / 
          {product.title}
        </div>

        {/* Title & Wishlist */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-semibold leading-tight">
          {product.title}
          </h1>
          <WishlistButton 
            productId={product.id} 
            productData={product}
            className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100"
          />
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm">
          {product.description}
        </p>

        {/* Price & Discount */}
        <div className="flex items-center gap-4 text-lg font-semibold">
          <span className="text-black">₹{offerPrice}</span>
          <span className="line-through text-gray-400 text-base">₹{originalPrice}</span>
          <span className="text-indigo-600 text-sm">{discountPercent}% off</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          {[...Array(4)].map((_, i) => (
            <Star key={i} size={18} fill="#FBBF24" stroke="#FBBF24" />
          ))}
          <Star size={18} stroke="#FBBF24" />
          <span className="text-sm text-gray-600 ml-2">{product.rating.count} reviews</span>
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
                className="w-full h-full object-fill"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        {/* Main Image */}
        <div className="rounded-xl overflow-hidden w-120 aspect-square bg-gray-100">
          <img
            src={product.image}
            alt="Product"
            className="w-120 h-120 object-fit"
          />
        </div>

        {/* Bag Color */}
        <div>
          <h4 className="text-sm font-medium mb-2">Bag Color</h4>
          <div className="flex gap-3">
            {product.colors?.map((color, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-red-500' : 'border-gray-300'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Bag Size */}
        <div>
          <h4 className="text-sm font-medium mb-2 mt-2">Bag Size</h4>
          <div className="flex gap-3">
            {product.sizes?.map((size, i) => (
              <button
                key={i}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border ${
                  selectedSize === size
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
            disabled={cartQuantity === 0}
          >
            −
          </button>
          <span className="w-8 text-center text-base">{cartQuantity}</span>
          <button
            onClick={() => {
              if (cartQuantity === 0) {
                addToCart(product);
              } else {
                incrementQuantity(product);
              }
            }}
            className="w-10 h-10 border rounded-full flex items-center justify-center text-xl"
          >
            +
          </button>
          
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          {cartQuantity > 0 ? 
          <button 
          onClick={() => removeFromCart(product.id)}
           className="flex-1 bg-red-100 text-red-700 font-medium px-4 py-2 rounded-full hover:bg-indigo-200 transition">
            Remove from Cart
          </button>
          
          :
          <button 
          onClick={() => {

            if (cartQuantity === 0) {
              addToCart(product);
            } else {
              incrementQuantity(product);
            }
          }}
           className="flex-1 bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-full hover:bg-indigo-200 transition">
            Add To Cart
          </button>}
          <button className="flex-1 bg-indigo-600 text-white font-medium px-4 py-2 rounded-full hover:bg-indigo-700 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
