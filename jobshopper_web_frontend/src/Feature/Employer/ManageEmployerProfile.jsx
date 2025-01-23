 
import { Outlet,   } from "react-router-dom";

 
const ManageEmployerProfile = () => {
 

  return (
    <div className="md:w-3/4">
      <div className="">
        <Outlet />
      </div>

      
    </div>
  );
};

export default ManageEmployerProfile;
