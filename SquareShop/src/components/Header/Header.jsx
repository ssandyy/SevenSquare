import { useNavigate } from "react-router-dom";
import RightSidebar from "../Drawer_Sidebar/RightSidebar";
import RightMenu from "./RightMenu";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-gray-500 sticky top-0 z-50 shadow-sm">
      <div className="flex-1">
        <button onClick={()=> navigate('/')} className="btn btn-ghost text-xl">
            SquareShop
        </button>
      </div>
      

      {/* ✅ Visible only on ≥870px */}
      <div className="hidden  min-[870px]:flex items-center gap-3">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
        <RightMenu />
      </div>

      {/* ✅ Drawer toggle only on <870px */}
      <div className="block min-[870px]:hidden">
        <RightSidebar />
      </div>
    </div>
  )
}

export default Header