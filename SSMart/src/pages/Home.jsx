import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { Product } from "../components";

const Home = () => {
  const { products } = useContext(ProductContext);
  console.log(JSON.stringify(products, null, 2));


  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Homepage </h2>
       <Product product={products}/>
    </div>
  );
};

export default Home;
