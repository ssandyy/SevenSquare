import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminDasboard = () => {
    const { userData } = useSelector(state => state.auth);
    
    // Check if user is admin
    if (!userData?.isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};


export default AdminDasboard