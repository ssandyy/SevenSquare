import { useCartContext } from "../../contexts/CartContext/CartContext";

const Cart = () => {
  const {
    state: { cart },
    dispatch
  } = useCartContext();

  const handleRemove = (id) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id }
    });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({
      type: "UPDATE_CART_QUANTITY",
      payload: { id, quantity }
    });
  };

  const subTotal = cart.reduce((acc, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    return acc + price * quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-2xl font-semibold">Your Cart is Empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      <div className="grid grid-cols-1 gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h4 className="font-semibold text-lg">{item.productName}</h4>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
                className="select select-bordered w-20"
              >
                {[...Array(item.inStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>

              <button
                className="btn btn-error btn-sm"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-bold">Subtotal: ₹{subTotal}</h3>
        <button className="btn btn-primary">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
