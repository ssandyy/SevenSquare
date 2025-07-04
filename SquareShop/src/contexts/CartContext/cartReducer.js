
export const cartReducer = (state, action) => {
    // if (action.type === "INCREMENT") {
    //     console.log("Hello reducer");
    //     return state
    // }
    if (action.type === "ADD_TO_CART") {
        console.log("Add cart reducer called");
        state = {
            ...state,
            cart:[...state.cart, action.payload] //previous data + payload data
        }
        
        return state;
    }
    if (action.type === "REMOVE_FROM_CART") {
        state = {
            ...state,
            cart: state.cart.filter((item) => item.id !== action.payload.id)
        }
        return state;
    }
    if (action.type === "UPDATE_CART_QUANTITY") {
        state = {
            ...state,
            cart: state.cart.map((item)=> {
                item.id === action.payload ? {...item, quantity: action.payload.quantity} : item 
            })
        }

        
        return state;
    }


}
