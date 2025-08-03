
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const LayoutAdmin = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAdmin;
