import { Trash2 } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/pagination/Pagination";
import usePagination from "../components/pagination/usePagination";
import CartContext, { getDiscountedPrice } from "../contexts/CartContext";

const CartDetails = () => {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart, cartTotal, totalSaving, discountedPrice, totalDiscountedPrice} = useContext(CartContext);

  // Debug: Log cart items to see their structure
  console.log('Cart items:', cart);

  // Use pagination for cart items (show 5 items per page on mobile, 10 on desktop)
  const { currentPage, setCurrentPage, currentProducts: currentCartItems, totalItems, itemsPerPage } = usePagination(cart, 5);

  // Calculate store pickup charge: 10% of discounted price for each unique product (by ID)
  const uniqueProducts = Array.from(new Map(cart.map(p => [p.id, p])).values());
  const storePickupTotal = uniqueProducts.reduce((sum, product) => {
    // Use getDiscountedPrice to get offerPrice for each product
    const offerPrice = getDiscountedPrice(product.price).offerPrice;
    return parseFloat(sum + (parseFloat(offerPrice) * 0.1))
  }, 0).toFixed(2);

  const tax = (parseFloat((cartTotal) * 0.15)).toFixed(2);
  const total = parseFloat (parseFloat(totalDiscountedPrice) + parseFloat(tax) + parseFloat(storePickupTotal)).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Shopping Cart ({cart.length} items)
          </h2>
          
          <div className="mt-4 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-6" >
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            {currentCartItems.map((product) => ( 
              <div key={product.id} className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                  <div className="space-y-4 md:flex md:items-start md:justify-between md:gap-6 md:space-y-0">
                    {/* Product Image and Details */}
                    <div className="flex items-start space-x-4 md:flex-1">
                  <Link to={`/product/${product.id}`}>
                      <img
                          className="h-20 w-20 rounded-lg object-cover"
                        src={product.image}
                          alt={product.name}
                        />
                      </Link>
                      
                      {/* Product Information */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                            {product.name || product.title || 'Product Name'}
                          </h3>
                    </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {product.description || product.title || 'No description available'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{getDiscountedPrice(product.price).offerPrice}
                          </span>
                          {product.price !== getDiscountedPrice(product.price).offerPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls and Remove Button */}
                    <div className="flex items-center justify-between md:flex-col md:items-end md:space-y-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                    <label htmlFor="counter-input" className="sr-only">
                      Choose quantity:
                    </label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          type="button"
                          onClick={() => decrementQuantity(product)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-l-lg border-r border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <svg
                              className="h-3 w-3 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 1h16"
                            />
                          </svg>
                        </button>
                        <input
                          type="text"
                            className="w-12 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                          value={product.quantity}
                            readOnly
                        />
                        <button
                          type="button"
                          onClick={() => incrementQuantity(product)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-r-lg border-l border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <svg
                              className="h-3 w-3 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 1v16M1 9h16"
                            />
                          </svg>
                        </button>
                      </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Cart Pagination */}
            {cart.length > 5 && (
              <div className="mt-6">
                <Pagination 
                  totalItems={totalItems} 
                  itemsPerPage={itemsPerPage} 
                  currentPage={currentPage} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            )}
            </div>

            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="voucher"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      Do you have a voucher or gift card?{" "}
                    </label>
                    <input
                      type="text"
                      id="voucher"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder=""
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Apply Code
                  </button>
                </form>
              </div>


              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order summary
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Original price
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        ₹{cartTotal}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Discounted price
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        ₹{discountedPrice}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Savings
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        -₹ {totalSaving}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Store Pickup
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        ₹{storePickupTotal}
                      </dd>
                    </dl>

                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Tax
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        ₹{tax}
                      </dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      ₹{total}
                    </dd>
                  </dl>
                </div>

                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Proceed to Checkout
                </a>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    or{" "}
                  </span>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Continue Shopping
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartDetails;
