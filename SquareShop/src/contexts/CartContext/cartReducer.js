export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload
      };

    case 'FILTERED_PRODUCTS':
      if (JSON.stringify(state.products) === JSON.stringify(action.payload)) {
    return state;
  }
  return {
    ...state,
    products: action.payload
  };

    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      const updatedCart = existingItem
        ? state.cart.map(item =>
            item.id === action.payload.id
              ? { 
                  ...item, 
                  quantity: Math.min(
                    item.quantity + action.payload.quantity,
                    item.inStock || 20
                  )
                }
              : item
          )
        : [...state.cart, action.payload];
      
      return { 
        ...state, 
        cart: updatedCart 
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id)
      };

    case 'CLEAR_CART':
      return { 
        ...state, 
        cart: [], 
        currentUserCartId: null 
      };

    case 'UPDATE_CART_QUANTITY': {
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { 
                ...item, 
                quantity: Math.min(
                  Number(action.payload.quantity),
                  item.inStock || 20
                )
              }
            : item
        )
      };
    }

    case 'SET_CART':
      return {
        ...state,
        cart: action.payload.cart || [],
        currentUserCartId: action.payload.cartId || null,
        isLoading: action.payload.isLoading ?? state.isLoading
      };

    case 'MERGE_CARTS': {
      // Create a map for efficient merging
      const cartMap = new Map();
      
      // Add user cart items first
      action.payload.userCart.forEach(item => 
        cartMap.set(item.id, { ...item })
      );
      
      // Merge guest cart items
      action.payload.guestCart.forEach(item => {
        if (cartMap.has(item.id)) {
          const existing = cartMap.get(item.id);
          cartMap.set(item.id, {
            ...existing,
            quantity: Math.min(
              existing.quantity + item.quantity,
              existing.inStock || 20
            )
          });
        } else {
          cartMap.set(item.id, { ...item });
        }
      });
      
      return {
        ...state,
        cart: Array.from(cartMap.values())
      };
    }

    case 'SET_CART_ID':
      return {
        ...state,
        currentUserCartId: action.payload.currentUserCartId
      };

    default:
      return state;
  }
};