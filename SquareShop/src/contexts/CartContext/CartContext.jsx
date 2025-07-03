import { faker } from '@faker-js/faker';
import { createContext, useContext, useReducer } from "react";
import { cartReducer } from './cartReducer';



const CartContext = createContext();

const CartContextProvider = ({ children }) => {
    // const [products, setProducts] = useState(['a']);

    const products = [...Array(15)].map(() => ({
        id: faker.string.uuid(),
    productName: faker.commerce.productName(),
    productDescription: faker.commerce.productDescription(),
    price: faker.number.int({ min: 0, max: 5000 }),
    image: faker.image.urlPicsumPhotos({
      width: 300,
      height: 300,
    }),
    inStock: faker.helpers.arrayElement([0, 5, 10, 15, 20]),
    fastDelivery: faker.datatype.boolean(),
    new: faker.datatype.boolean(),
    ratings: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
  }));

    // const state = {
    //     products,  // objects of values
    // }
    
    //using reducer
    const [state, dispatch] = useReducer(cartReducer, {
        products,
    })

    return (<CartContext.Provider value={state}> {children}</CartContext.Provider>);
}

const useCartContext = () => {
  return useContext(CartContext);
};

export { CartContextProvider, useCartContext };

    
