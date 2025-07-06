export const cartReducer = (state, action) => {
  
      if (action.type === 'SET_STATE') {
      return {
        ...state,
        ...action.payload
      };
    }

  if (action.type === "ADD_TO_CART") {
    // console.log("Add cart reducer called");
    return {
      ...state,
      cart: [...state.cart, action.payload],
    };
  }

  if (action.type === "REMOVE_FROM_CART") {
    return {
      ...state,
      cart: state.cart.filter((item) => item.id !== action.payload.id),
    };
  }

  if (action.type === "UPDATE_CART_QUANTITY") {
    return {
      ...state,
      cart: state.cart.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ),
    };
  }

  return state;
};
