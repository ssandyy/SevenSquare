import FilterBar from "../../components/FilterBar/FilterBar"
import AllProducts from "../../components/Products/AllProducts"
import Body from "./Body/Body"

const Home = () => {
  return (
    <>
       <div className="flex">
        <div className="block max-[870px]:hidden">
          <FilterBar />
        </div>
        <div>
            <Body />      
        </div>
        
        
      </div>
    </>
  )
}

export default Home