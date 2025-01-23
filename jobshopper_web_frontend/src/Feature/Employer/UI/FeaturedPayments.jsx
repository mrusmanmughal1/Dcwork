import { useState } from "react";
import { useGetCardNumbers } from "../../../Services/Featuredjob/useGetCardNumbers";
import { useFeaturedjob } from "../../../Services/Jobs/useFeaturedjob";
import mastercard from "../../../assets/mastercard.png";
import MiniLoader from "../../../UI/MiniLoader";
import ErrorMsg from "../../../UI/ErrorMsg";
import { useRemovePaymentAccount } from "../../../Services/Featuredjob/useRemovePaymentAccount";
import { useUserinfo } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const FeaturedPayments = ({ jobid, setfeaturepage, handleClose }) => {
  const queryClient = useQueryClient();

  const { user_id } = useUserinfo();
  const { mutate: featured, isPending: loadFeatured } = useFeaturedjob();
  const [payid, setpayid] = useState();
  const { data, isLoading, isError } = useGetCardNumbers();
  const { mutate: deleteAccount, isPending } = useRemovePaymentAccount();
  const [delid, setdelid] = useState();
  const handleFeatures = () => {
    featured(
      {
        payment_profile_id: payid,
        jobid,
      },
      {
        onSuccess: () => {
          setpayid(null);
          handleClose();
        },
      }
    );
  };
  if (isLoading)
    return (
      <div className="py-10">
        <MiniLoader />
      </div>
    );
  const HandleDeletCard = (val) => {
    setdelid(val.customerPaymentProfileId);
    deleteAccount(
      {
        user: user_id,
        payment_profile_id: val.customerPaymentProfileId,
      },
      {
        onSuccess: () => {
          setdelid("");

          toast.success("Account deleted successfully", { id: "success" });
          queryClient.invalidateQueries(["featuredcards"]);
        },
      }
    );
  };

  return (
    <div>
      <div className="border-2 space-y-3 p-4">
        <p className="font-semibold text-btn-primary">Select Payment Methods</p>
        <p className="text-xs font-medium">Payment Method</p>
        {data?.data?.paymentProfiles?.map((val, i) => {
          return (
            <div
              key={i}
              className={`border   flex items-center justify-between p-2 rounded-md  ${
                payid === val.customerPaymentProfileId
                  ? "border-btn-primary"
                  : "border-gray-300"
              }  `}
            >
              <div className="flex items-center gap-4">
                <div className="w-20  overflow-hidden">
                  <img
                    src={mastercard}
                    width="100%"
                    height="100%"
                    alt="Mater Card"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="">
                  <p className="font-semibold">
                    {" "}
                    **** **** **** {val.payment.creditCard.cardNumber.slice(-4)}
                  </p>
                  <p className="text-xs">
                    {" "}
                    Type : {val.payment.creditCard.cardType}
                  </p>
                </div>
              </div>
              <div className="flex items-center  gap-2">
                <button
                  disabled={isPending}
                  onClick={() => HandleDeletCard(val)}
                  className="border-btn-primary hover:bg-red-900 disabled:cursor-not-allowed hover:text-white border rounded-md text-xs px-2 py-1"
                >
                  {delid == val.customerPaymentProfileId ? (
                    <MiniLoader />
                  ) : (
                    " Remove"
                  )}
                </button>
                <input
                  type="checkbox"
                  checked={payid === val.customerPaymentProfileId}
                  className="w-5 h-5 peer   accent-purple-800  cursor-pointer"
                  onChange={() => setpayid(val.customerPaymentProfileId)}
                />
              </div>
            </div>
          );
        })}
        <div className=" ">
          <button
            onClick={() => setfeaturepage(2)}
            className="bg-btn-primary p-2 rounded-md text-white font-medium px-4"
          >
            Add New Payment Method
          </button>
        </div>
      </div>

      <div className="text-end mt-3">
        <button
          disabled={!payid}
          onClick={handleFeatures}
          className="bg-btn-primary p-2 disabled:cursor-not-allowed disabled:bg-purple-800 rounded-md text-white font-medium px-4"
        >
          {loadFeatured ? <MiniLoader /> : "Detection Amount : 5$"}
        </button>
      </div>
    </div>
  );
};

export default FeaturedPayments;
