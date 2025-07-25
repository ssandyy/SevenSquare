import { useContext } from "react";
import { Link } from "react-router-dom";
import CartContext, { getDiscountedPrice } from "../contexts/CartContext";


const CartDetails = () => {
  const { cart, incrementQuantity, decrementQuantity, removeFromCart, cartTotal, totalSaving, discountedPrice, totalDiscountedPrice} = useContext(CartContext);


  // Calculate store pickup charge: 10% of discounted price for each unique product (by ID)
  const uniqueProducts = Array.from(new Map(cart.map(p => [p.id, p])).values());
  const storePickupTotal = uniqueProducts.reduce((sum, product) => {
    // Use getDiscountedPrice to get offerPrice for each product
    const offerPrice = getDiscountedPrice(product.price).offerPrice;
    return parseFloat(sum + (parseFloat(offerPrice) * 0.1))
  }, 0).toFixed(2);

  const tax = (parseFloat((cartTotal) * 0.15)).toFixed(2);
  const total = parseFloat (parseFloat(totalDiscountedPrice) + parseFloat(tax) + parseFloat(storePickupTotal)).toFixed(2);

  return (
    <div>
      <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Shopping Cart
          </h2>
          
          <div class="mt-4 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-6" >
            <div class="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            {cart.map((product) => ( 
              <div class="space-y-6">
                <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                  <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                  <Link to={`/product/${product.id}`}>
                    <a href="#" class="shrink-0 md:order-1">
                    
                      <img
                        class="h-20 w-20 dark:hidden"
                        src={product.image}
                        alt="imac image"
                      />
                      {/* <img
                        class="hidden h-20 w-20 dark:block"
                        src={product.image}
                        alt="imac image"
                      /> */}
                    </a>
                    </Link>
                    <label for="counter-input" class="sr-only">
                      Choose quantity:
                    </label>
                    <div class="flex items-center justify-between md:order-3 md:justify-end">
                      <div class="flex items-center">
                        <button
                          type="button"
                          id="decrement-button"
                          data-input-counter-decrement="counter-input"
                          onClick={() => decrementQuantity(product)}
                          class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                          <svg
                            class="h-2.5 w-2.5 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M1 1h16"
                            />
                          </svg>
                        </button>
                        <input
                          type="text"
                          id="counter-input"
                          data-input-counter
                          class="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                          placeholder=""
                          value={product.quantity}
                          required
                        />
                        <button
                          type="button"
                          id="increment-button"
                          onClick={() => incrementQuantity(product)}
                          data-input-counter-increment="counter-input"
                          class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                          <svg
                            class="h-2.5 w-2.5 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 1v16M1 9h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <div class="text-end md:order-4 md:w-32">
                        <p class="text-base font-bold text-gray-900 dark:text-white">
                          ${getDiscountedPrice(product.price).offerPrice}
                        </p>
                      </div>
                    </div>

                    <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      
                        <Link to={`/product/${product.id}`}>
                          {product.title}
                        </Link>

                      <div class="flex items-center gap-4">
                        <button
                          type="button"
                          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                        >
                          <svg
                            class="me-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                            />
                          </svg>
                          Add to Favorites
                        </button>

                        <button
                          type="button"
                          class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <svg
                            class="me-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18 17.94 6M18 18 6.06 6"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
              ))}
          
              {/* People also bought - always visible, horizontal scroll */}
              {/* {cart.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  People also bought
                </h3>
                <div className="w-full">
                  <Product
                    product={peopleAlsoBoughtProducts}
                    containerClassName="
                      flex flex-row gap-4 overflow-x-auto
                      md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6
                      hide-scrollbar
                    "
                    cardClassName="
                      min-w-[70vw] max-w-xs sm:min-w-[260px] md:min-w-0
                      flex-shrink-0
                      bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200
                      border border-gray-200 p-4 flex flex-col items-center
                    "
                  />
                </div>
                <Pagination totalItems={products.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />

                
              </div>
              ): ( */}

              {cart.length <= 0 &&
                <div className="mt-2 flex flex-col items-center justify-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 inline-block align-middle text-yellow-400"
                    >
                      <circle cx="12" cy="12" r="10" fill="#FDE68A" stroke="#F59E42" strokeWidth="1.5" />
                      <ellipse cx="9" cy="10" rx="1.2" ry="1.5" fill="#444" />
                      <ellipse cx="15" cy="10" rx="1.2" ry="1.5" fill="#444" />
                      <path d="M9 16c1-1 5-1 6 0" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    No products in cart
                  </h3>
                  <p className="text-gray-500 text-base mt-1">Your cart is feeling lonely! 🛒</p>
                  <p className="text-gray-400 text-sm">Add some amazing products and make it happy.</p>
                  <a
                    href="/"
                    className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition"
                  >
                    Go Shopping
                  </a>
                </div>
              }
            </div>

            <div class="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <form class="space-y-4">
                  <div>
                    <label
                      for="voucher"
                      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      Do you have a voucher or gift card?{" "}
                    </label>
                    <input
                      type="text"
                      id="voucher"
                      class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder=""
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Apply Code
                  </button>
                </form>
              </div>


              <div class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p class="text-xl font-semibold text-gray-900 dark:text-white">
                  Order summary
                </p>

                <div class="space-y-4">
                  <div class="space-y-2">
                    <dl class="flex items-center justify-between gap-4">
                      <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                        Original price
                      </dt>
                      <dd class="text-base font-medium text-gray-900 dark:text-white">
                      ${cartTotal}
                      </dd>
                    </dl>
                    <dl class="flex items-center justify-between gap-4">
                      <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                        Discounted price
                      </dt>
                      <dd class="text-base font-medium text-gray-900 dark:text-white">
                        ${discountedPrice}
                      </dd>
                    </dl>

                    <dl class="flex items-center justify-between gap-4">
                      <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                        Savings
                      </dt>
                      <dd class="text-base font-medium text-green-600">
                        -$ {totalSaving}
                      </dd>
                    </dl>

                    <dl class="flex items-center justify-between gap-4">
                      <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                        Store Pickup
                      </dt>
                      <dd class="text-base font-medium text-gray-900 dark:text-white">
                        ${storePickupTotal}
                      </dd>
                    </dl>

                    <dl class="flex items-center justify-between gap-4">
                      <dt class="text-base font-normal text-gray-500 dark:text-gray-400">
                        Tax
                      </dt>
                      <dd class="text-base font-medium text-gray-900 dark:text-white">
                        ${tax}
                      </dd>
                    </dl>
                  </div>

                  <dl class="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt class="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd class="text-base font-bold text-gray-900 dark:text-white">
                      ${total}
                    </dd>
                  </dl>
                </div>

                <a
                  href="#"
                  class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Proceed to Checkout
                </a>

                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {" "}
                    or{" "}
                  </span>
                  <a
                    href="#"
                    title=""
                    class="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                  >
                    Continue Shopping
                    <svg
                      class="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4"
                      />
                    </svg>
                  </a>
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
