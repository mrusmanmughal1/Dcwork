import moment from "moment";
import { useGetPayments } from "../../Services/Featuredjob/useGetPayments";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";

const PaymentHistory = () => {
  const {
    data: payments,
    isError,
    isLoading,
    page,
    next,
    pre,
  } = useGetPayments();

  if (isLoading) return <Loader style="py-20" />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg={"Sorry Unable to fetch Data Try Again Later !"} />
    );
  if (payments?.data?.count === 0)
    return (
      <ErrorMsg
        ErrorMsg={
          "No Payment History Available , Feature a Job First To View Payments"
        }
      />
    );

  return (
    <div>
      <div className="ps-2 pb-2 flex justify-between items-center">
        <div className="font-semibold  ">
          Payment History ({payments?.data?.count})
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={pre}
            disabled={!payments?.data?.previous}
            className="bg-slate-200   p-1 disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoMdArrowRoundBack />
          </button>
          {page}
          <button
            onClick={next}
            disabled={!payments?.data?.next}
            className="bg-slate-200   p-1 disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoMdArrowRoundForward />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-4 rounded-md border">
        {/* Table to display payment data */}
        <table className="min-w-full bg-white   rounded-md ">
          <thead className="bg-gray-200">
            <tr className="md:text-base text-sm">
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Date & Time</th>
              <th className="py-2 px-4 border-b text-left">Card Number</th>
              <th className="py-2 px-4 border-b text-left">Transaction ID</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {/* Map through the payments data and create rows */}
            {payments?.data?.results?.map((val, i) => {
              const date = moment(val?.date_time).format("MMM DD, YYYY");
              const time = moment(val?.date_time).format("hh:mm:ss A");
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b"> {val.description} </td>
                  <td className="py-2 px-4 border-b">
                    <p>{date}</p>
                    <p className="text-xs">{time}</p>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {val.masked_card_number}
                  </td>
                  <td className="py-2 px-4 border-b">{val.transaction_id}</td>
                  <td className="py-2   text-ce px-4 border-b">
                    {val.amount}$
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
