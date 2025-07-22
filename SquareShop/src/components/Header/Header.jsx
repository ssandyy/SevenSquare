import { useNavigate } from "react-router-dom";
import RightSidebar from "../Drawer_Sidebar/RightSidebar";
import RightMenu from "./RightMenu";
import SearchField from "./SearchField";
import Logo from "../Logo";

const Header = () => {
  const navigate = useNavigate();
  
  
  return (
    <div className="navbar bg-gray-500 sticky top-0 z-50 shadow-sm">
      <div className="flex-1">
        <button onClick={()=> navigate('/')} className="btn btn-ghost text-xl">
            <Logo />
        </button>
      </div>
      

      {/* ✅ Visible only on ≥870px */}
      <div className="hidden  min-[870px]:flex items-center gap-3">
        <SearchField />
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