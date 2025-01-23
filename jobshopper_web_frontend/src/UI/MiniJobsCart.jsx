import { IoCartSharp } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";
import { useGetBasket } from "../Services/Candidate/useGetBasket";
import { BsStopwatch } from "react-icons/bs";
import MiniLoader from "./MiniLoader";
import { FiMapPin } from "react-icons/fi";
import { SlBasket } from "react-icons/sl";
import { NavLink } from "react-router-dom";
import { useClearJobBasket } from "../Services/Candidate/useClearJobBasket";
import { RxCross2 } from "react-icons/rx";
const MiniJobsCart = ({ setcart }) => {
  const { data, isLoading, isError } = useGetBasket({
    enabled: false,
  });
  const {
    mutate: Clearcart,
    isPending: cartloading,
    isError: cartError,
  } = useClearJobBasket();
  const { mutate: clearSingel, isPending: load } = useClearJobBasket();
  if (isLoading) return <MiniLoader />;
  const reversedResults = data?.data?.results
    ? [...data.data.results.results]
    : [];

  const handleClear = () => {
    Clearcart();
  };
  const handleRemove = (id) => {
    // setRejectLoad(id);
    clearSingel(id);
  };

  if (data.data.results.count == 0)
    return (
      <div className="font-semibold pb-4">
        {" "}
        <p className="uppercase">Jobs Cart</p>
        <p className="bg-gray-50 p-2 flex gap-2 text-blackx">
          <SlBasket /> No jobs in cart
        </p>
      </div>
    );
  if (isError)
    return (
      <div className="font-semibold pb-4">
        {" "}
        <p className="uppercase">Jobs Cart</p>
        <p className="bg-gray-50 p-2 flex gap-2 text-blackx">
          <SlBasket /> Try Later..{" "}
        </p>
      </div>
    );
  return (
    <div>
      <div className=" ">
        <div className="font-semibold pb-4  "> JOBS IN YOUR CART</div>
        <div className="max-h-60 min-h-20 pe-2 overflow-y-auto">
          {reversedResults.map((val) => {
            return (
              <div
                key={val.id}
                className=" relative flex flex-col gap-1 bg-slate-100 p-2 ps-4 mb-2"
              >
                <button
                  onClick={() => handleRemove(val.id)}
                  className="absolute right-0  cursor-pointer hover:bg-btn-primary text-xs top-0 z-[99] bg-gray-500 rounded-full text-white "
                >
                  <RxCross2 />
                </button>
                <p className="uppercase font-semibold font-sm ">{val?.title}</p>
                <div className="text-xs text-black flex items-center gap-2 ">
                  <FiMapPin />{" "}
                  {val?.hybrid
                    ? "Hybrid"
                    : val?.remote
                    ? "Remote "
                    : val?.addresses?.map((address, i) => (
                        <span key={i}>
                          {address.city}
                          {i < val.addresses?.length - 1 && ","}{" "}
                        </span>
                      ))}
                </div>

                <p className="text-xs flex gap-2 text-btn-primary font-medium">
                  <BsStopwatch /> Contract
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-white py-4  uppercase font-semibold">
          <NavLink
            to="dashboard/jobs-basket"
            onClick={() => setcart(false)}
            className="bg-btn-primary  text-white px-4 py-3 rounded-md uppercase  flex items-center gap-3"
          >
            <IoCartSharp /> Basket
          </NavLink>
          <button
            onClick={() => handleClear()}
            className="bg-btn-primary px-4 py-3 rounded-md flex items-center uppercase gap-3"
          >
            {cartloading ? (
              <MiniLoader />
            ) : (
              <div className="flex items-center gap-2">
                <FaTelegramPlane /> Clear
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniJobsCart;
