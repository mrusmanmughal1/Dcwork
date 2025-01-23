const CandidateContact = ({
  email,
  username,
  phone,
  city,
  country,
  handleDownload,
}) => {
  return (
    <div className="md:w-1/4">
      <div className="bg-slate-100">
        <div className="p-4 font-semibold text-white uppercase bg-btn-primary">
          CONTACT {username}
        </div>

        <div className="flex p-4 flex-col gap-4 py-4">
          <div className="">
            <p className="text-btn-primary font-semibold ">Address</p>
            <p>
              {city} , {country}
            </p>
          </div>
          <div className="">
            <p className="text-btn-primary font-semibold "> Email</p>
            <p>{email}</p>
          </div>
          <div className="">
            <p className="text-btn-primary font-semibold "> Call</p>
            <p>{phone} </p>
          </div>
        </div>
      </div>
      <div className="  flex   flex-col  gap-2 py-2 ">
        <button
          className="bg-btn-primary text-white p-4 rounded-md font-semibold"
          onClick={handleDownload}
        >
          DOWNLOAD CV{" "}
        </button>
      </div>
    </div>
  );
};

export default CandidateContact;
