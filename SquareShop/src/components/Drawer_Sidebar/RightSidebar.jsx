import FilterBar from "../FilterBar/FilterBar"
import RightMenu from "../Header/RightMenu"
import SearchField from "../Header/SearchField"

const RightSidebar = () => {
  return (
        <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      
      {/* Button to open drawer */}
      <div className="drawer-content">
          <label htmlFor="my-drawer-4" className="btn btn-circle swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" />

            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512">
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512">
              <polygon
                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
      </div>

      {/* Drawer contents */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay">
          
        </label>
        
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
          {/* ✅ Search inside drawer */}
          <SearchField />

          {/* ✅ Cart/Profile inside drawer */}
          <RightMenu />

          <hr />
          
          {/* Filters */}
          <FilterBar />
        </div>
      </div>
    </div>
    
  )
}

export default RightSidebar