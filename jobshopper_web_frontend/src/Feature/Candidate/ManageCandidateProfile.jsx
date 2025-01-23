import { Outlet } from "react-router-dom";

const ManageCandidateProfile = () => {
  return (
    <div className="md:w-3/4">
      <Outlet />
    </div>
  );
};

export default ManageCandidateProfile;
