import { useCartContext } from "../../contexts/CartContext/CartContext";

const Cart = () => {
  const {
    state: { cart },
    dispatch,
  } = useCartContext();

  const handleRemove = (id) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id },
    });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({
      type: "UPDATE_CART_QUANTITY",
      payload: { id, quantity: Number(quantity) },
    });
  };

  const subTotal = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-2xl font-semibold">Your Cart is Empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      <div
        className={`space-y-4 pr-2 ${cart.length > 3 ? "h-[500px] overflow-y-auto" : ""
          }`}
      >
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-sm text-gray-500">₹{item.price}</p>
                <div className="mt-2">
                  <label className="mr-2 text-sm text-gray-600">Qty:</label>

                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_CART_QUANTITY",
                        payload: { id: item.id, quantity: Number(e.target.value) },
                      })
                    }
                    className="border rounded px-2 py-1"
                    style={{
                      overflowY: "auto",
                      maxHeight: "150px", // limit dropdown scroll height
                    }}
                  >
                    {[...Array(item.inStock || 20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="btn btn-sm btn-error"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-xl font-semibold">
        Subtotal: ₹{subTotal}
      <button className="btn btn-primary mt-4 ml-5">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
