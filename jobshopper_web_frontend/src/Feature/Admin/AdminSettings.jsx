const AdminSettings = () => {
  return (
    <div>
      <div className="font-semibold text-2xl uppercase ">
        Your Profile Settings
      </div>
      <div className="w-1/2 mx-auto py-12">
        <form action="">
          <div className=" flex flex-col  gap-2">
            <label htmlFor="" className="font-semibold uppercase p-2">
              Password{" "}
            </label>
            <input
              type="text"
              className="p-2 rounded-md border border-purple-100 shadow-sm"
            />
          </div>

          <div className=" flex flex-col  gap-2">
            <label htmlFor="" className="font-semibold uppercase p-2">
              Update Password{" "}
            </label>
            <input
              type="text"
              className="p-2 rounded-md border border-purple-100 shadow-sm"
            />
          </div>

          <div className="  flex justify-between py-3">
            <button className="px-4 py-3 bg-btn-primary text-white rounded-md">
              {" "}
              Update Profile{" "}
            </button>
            <button className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md">
              {" "}
              Delete Profile{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
