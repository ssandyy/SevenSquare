import FilterBar from "../../components/FilterBar/FilterBar"
import Body from "./Body/Body"

const Home = () => {
  return (
    <>
     
       <div className="flex">
        <div className="max-[570px]:hidden">
          <FilterBar />
        </div>
        <Body />
      </div>
    </>
  )
}

export default Home