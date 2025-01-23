import { Outlet } from "react-router-dom";
import AdminSideBar from "../AdminSideBar";

const AdminDashboard = () => {
  return (
    <div>
      <div className="flex         mx-auto   md:flex-row flex-col  ">
        <div className="md:w-[25%] flex  py-10 ps-10  bg-purple-950 text-white px-4    w-full">
          <AdminSideBar />
        </div>
        <div className=" md:w-[75%] w-full  mx-auto bg-purple-100 p-2 md:p-10 pb-20  ">
          {" "}
          {<Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
