export const cartReducer = (state, action) => {
  
    if (action.type === 'SET_STATE') {
    return {
      ...state,
      ...action.payload
    };
    }

    if(action.type === 'FILTERED_PRODUCTS'){
      return {
        ...state,
        products: action.payload
      }
    }

    if(action.type === "SET_PRODUCTS"){
         
    state = {...state, products: action.payload};
    return state;

      }

  if(action.type === "SET_LOADING"){
      return {
        ...state,
        isLoading: action.payload
      };
  }

  if(action.type === 'ADD_TO_CART'){
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      const updatedCart = existingItem
        ? state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        : [...state.cart, action.payload];
      
      return { 
        ...state, 
        cart: updatedCart 
      };
    }

  if (action.type === "REMOVE_FROM_CART") {
    return {
      ...state,
      cart: state.cart.filter((item) => item.id !== action.payload.id),
    };
  }

  if (action.type === "CLEAR_CART"){
    return { 
        ...state, 
        cart: [], 
        currentUserCartId: null 
  }}
  

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

  if(action.type === "SET_CART") {
     return {
        ...state,
        cart: action.payload.cart || [],
        currentUserCartId: action.payload.cartId || null,
        isLoading: action.payload.isLoading !== undefined ? action.payload.isLoading : state.isLoading
  }
}

if(action.type === "MERGE_CARTS"){
  const mergedCart = [...action.payload.userCart, ...action.payload.guestCart]
        .reduce((acc, item) => {
          const existing = acc.find(i => i.id === item.id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
      
      return { ...state, cart: mergedCart };

}

 
};
