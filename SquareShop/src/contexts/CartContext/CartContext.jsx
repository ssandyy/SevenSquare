import { createContext, useContext, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import adminService from "../../appwrite/adminServices";
import service from "../../appwrite/serviceConfig";
import { cartReducer } from "./cartReducer";

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const { userData } = useSelector(state => state.auth);
  const [state, dispatch] = useReducer(cartReducer, {
    cart: [],
    currentUserCartId: null,
    isLoading: false,
    error: null,
    unfilteredProducts: [],
    filteredProducts: []
  });

  // Load cart and products when auth state changes
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Load products
        const products = await adminService.getProducts();
        dispatch({ 
          type: 'SET_PRODUCTS', 
          payload: {
            unfilteredProducts: products,
            filteredProducts: products
          }
        });

        // Load cart based on auth state
        if (userData) {
          const userCart = await service.getUserCart(userData.$id);
          dispatch({
            type: 'SET_CART',
            payload: {
              cart: userCart?.items ? JSON.parse(userCart.items) : [],
              cartId: userCart?.$id || null,
              isLoading: false
            }
          });
        } else {
          const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
          dispatch({
            type: 'SET_CART',
            payload: {
              cart: guestCart,
              cartId: null,
              isLoading: false
            }
          });
        }
      } catch (error) {
        console.error("Initial data load error:", error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: "Failed to load cart data. Please try again."
        });
      }
    };

    loadInitialData();
  }, [userData]);

  // Persist cart changes
  useEffect(() => {
    if (state.isLoading) return;

    const persistCart = async () => {
      try {
        if (userData) {
          if (state.currentUserCartId) {
            await service.updateUserCart(
              state.currentUserCartId, 
              state.cart,
              userData.$id
            );
          } else if (state.cart.length > 0) {
            const cartDoc = await service.createUserCart(state.cart, userData.$id);
            dispatch({
              type: 'SET_CART_ID',
              payload: { currentUserCartId: cartDoc.$id }
            });
          }
        } else {
          localStorage.setItem('guestCart', JSON.stringify(state.cart));
        }
      } catch (error) {
        console.error("Failed to persist cart:", error);
      }
    };

    const debounceTimer = setTimeout(persistCart, 500);
    return () => clearTimeout(debounceTimer);
  }, [state.cart, userData, state.currentUserCartId]);

  // Merge carts on login
  useEffect(() => {
    const mergeCarts = async () => {
      if (!userData || !state.currentUserCartId) return;
      
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      if (guestCart.length > 0) {
        try {
          dispatch({ type: 'MERGE_CARTS', payload: {
            userCart: state.cart,
            guestCart
          }});
          localStorage.removeItem('guestCart');
        } catch (error) {
          console.error("Failed to merge carts:", error);
        }
      }
    };

    mergeCarts();
  }, [userData, state.currentUserCartId]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContextProvider, useCartContext };

