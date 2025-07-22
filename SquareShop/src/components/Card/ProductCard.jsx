import { useCartContext } from "../../contexts/CartContext/CartContext";

const ProductCard = ({ product }) => {
  const { state: { cart }, dispatch } = useCartContext();
  const isInCart = cart.some(item => item.id === product.id);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity: 1
      }
    });
  };

  const handleRemoveFromCart = () => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id: product.id }
    });
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>In Stock: {product.inStock}</p>
      
      {isInCart ? (
        <button onClick={handleRemoveFromCart} disabled={product.inStock <= 0}>
          Remove from Cart
        </button>
      ) : (
        <button 
          onClick={handleAddToCart} 
          disabled={product.inStock <= 0}
        >
          {product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      )}
    </div>
  );
};

export default ProductCard;