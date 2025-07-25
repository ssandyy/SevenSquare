import { Trash, Plus, Minus } from "lucide-react";
import { useContext } from "react";
import CartContext from "../contexts/CartContext";
import { getDiscountedPrice } from "../contexts/CartContext";

const CartItem = ({ item }) => {
  const { id, image, title, quantity, price } = item;
  const { removeFromCart, incrementQuantity, decrementQuantity } = useContext(CartContext);

  // Calculate discounted price for this item
  const offerPrice = parseFloat(getDiscountedPrice(price).offerPrice);
  const itemTotal = (offerPrice * quantity).toFixed(2);

  return (
    <>
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 w-full">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-12 h-12 object-fill rounded"
      />
      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium truncate max-w-[140px]">{title}</span>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => decrementQuantity(item)}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-gray-600 disabled:opacity-50"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold">{quantity}</span>
          <button
            onClick={() => incrementQuantity(item)}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 text-gray-600"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 ml-4">${offerPrice.toFixed(2)}</span>
          <span className="text-xs font-semibold ml-2">Total ${itemTotal}</span>
        </div>
      </div>
      {/* Delete */}
      <button
        onClick={() => removeFromCart(id)}
        className="text-gray-400 hover:text-red-500 ml-2"
        title="Remove from cart"
      >
        <Trash className="w-5 h-5" />
      </button>
    </div>
    <hr />
    
    </>
  );
};

export default CartItem;
