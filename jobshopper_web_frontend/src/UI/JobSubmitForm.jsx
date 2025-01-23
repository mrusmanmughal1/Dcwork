const JobSubmitForm = ({ setshowModel }) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className=" transform overflow-hidden rounded-lg justify-center flex-row flex bg-white text-left shadow-xl transition-all md:w-2/5 sm:my-8 sm:w-full   ">
            <div className="w-full">
              <div className="text-center py-4 bg-gray-200">
                <p className="font-semibold text-btn-primary text-2xl">
                  Application
                </p>

                <p className="text-lg font-semibold text-gray-700">Job Title</p>
              </div>
              <div className=" p-10">
                <form className="space-y-4">
                  <div className="">
                    <label>FUll Name </label>
                    <input type="text" className="w-full border py-2" />
                  </div>

                  <div className="">
                    <label>Email Address </label>
                    <input type="text" className="w-full border py-2" />
                  </div>

                  <div className="">
                    <label>FUll Name </label>
                    <textarea
                      cols={5}
                      rows={5}
                      type="text"
                      className="w-full border"
                    />
                  </div>
                  <div className="">
                    <p htmlFor=" text-2xl">CV*</p>
                    <input
                      type="file"
                      name=""
                      id=""
                      className="  p-4 file:bg-btn-primary file:text-white file:p-2"
                    />
                  </div>
                  <div className=" text-center py-10">
                    <button
                      onClick={() => setshowModel(false)}
                      className="font-semibold  bg-btn-primary text-white p-4 rounded-md"
                    >
                      {" "}
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSubmitForm;
