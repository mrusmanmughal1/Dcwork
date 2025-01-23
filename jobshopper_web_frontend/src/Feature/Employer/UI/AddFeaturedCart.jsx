import { useFormik } from "formik";
import { NewMethodCard } from "../../../helpers/Schema/FormValidation";
import { useCreateFeatureAccount } from "../../../Services/Featuredjob/useCreateFeatureAccount";
import { useUserinfo } from "../../../Context/AuthContext";
import MiniLoader from "../../../UI/MiniLoader";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import visa from "../../../assets/CreditCards/visa.png";
import mastercard from "../../../assets/CreditCards/master.png";
import amex from "../../../assets/CreditCards/amex.png";
import discover from "../../../assets/CreditCards/discover.png";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const AddFeaturedCart = ({ setfeaturepage }) => {
  const { mutate: createAccount, isPending } = useCreateFeatureAccount();
  const { user_id } = useUserinfo();
  const query = useQueryClient();

  const [rawValue, setRawValue] = useState("");
  const initialValues = {
    card_number: "",
    expiration_date: "",
    cvv: "",
    user: user_id,
  };

  const formatCardNumber = (cardNumber) => {
    const nmbr = cardNumber.startsWith(3);
    // Remove non-digit characters
    const cleaned = cardNumber.replace(/\D/g, "");

    // Format the number with hyphens
    return cleaned.length < (nmbr ? 15 : 16)
      ? cleaned.replace(/(\d{4})(?=\d)/g, "$1-").slice(0, 19)
      : "xxxx-xxxx-xxxx-" + cleaned.slice(-4);
  };

  const handlenumber = (e) => {
    const { value } = e.target;
    const cleaned = value.replace(/\D/g, ""); // Remove non-digit characters
    getCardImage(cleaned);
    // Format the card number with masking
    const formattedValue = formatCardNumber(cleaned);
    setRawValue(formattedValue);
    setFieldValue("card_number", cleaned);
    validateField("card_number");
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    validateField,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: (values) => {
      const cleanedValues = {
        ...values,
        // Remove spaces and hyphens before sending
      };
      createAccount(cleanedValues, {
        onSuccess: (res) => {
          toast.success(res.data.message);
          query.invalidateQueries(["featured-Jobs", "featuredcards"]);
          setfeaturepage(1);
        },
      });
    },
    validationSchema: NewMethodCard,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      // If backspace is pressed, show the previous digit
      const previousValue = values.card_number.slice(0, -1); // Remove last digit
      setRawValue(previousValue);
      setFieldValue("card_number", previousValue.replace(/\D/g, ""));
      validateField("card_number"); // Update Formik state with formatted value

      e.preventDefault(); // Prevent the default backspace behavior
    }
  };
  const handleCvvNumber = (e) => {
    const { value } = e.target;
    const cleaned = value.replace(/\D/g, ""); // Remove non-digit characters
    setFieldValue("cvv", cleaned); // Update Formik state with formatted value
  };
  const getCardImage = (number = 0) => {
    const cardNumber = String(number);
    if (cardNumber?.startsWith("4")) {
      return visa;
    } else if (cardNumber.startsWith("5")) {
      return mastercard;
    } else if (cardNumber.startsWith("34") || cardNumber.startsWith("37")) {
      return amex;
    } else if (
      cardNumber.startsWith("6011") ||
      cardNumber.startsWith("644") ||
      cardNumber.startsWith("645") ||
      cardNumber.startsWith("646") ||
      cardNumber.startsWith("647") ||
      cardNumber.startsWith("648") ||
      cardNumber.startsWith("649")
    ) {
      return discover;
    }
    return ""; // Return empty if no match
  };

  const image = getCardImage(values.card_number);
  const handleDateChange = (date) => {
    // Format the date to "YYYY-MM" format
    const formattedDate = date ? date.toISOString().slice(0, 7) : "";
    setFieldValue("expiration_date", formattedDate); // Update Formik's field value
  };
  return (
    <div className="p-4 border-2">
      <div className="mt-2">
        <h1 className="font-semibold text-btn-primary">
          Add New Payment Methods (Credit Card)
        </h1>
      </div>
      <div className="py-2">
        <div className="flex flex-col lg:flex-row items-start">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white">
            <div className="mb-4">
              <div className="">
                <div className=" flex items-center w-full  relative justify-between">
                  <label
                    htmlFor="card_number"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Card Number
                  </label>
                </div>
              </div>
              <div className="flex items-center  border">
                <input
                  type="text"
                  name="card_number"
                  id="card_number"
                  maxLength={19} // Allow for spaces in the input
                  placeholder="Credit Card Number"
                  value={rawValue}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onChange={handlenumber} // Apply formatting on change
                  className="w-full px-3 py-2     focus:outline-none focus:border-indigo-500"
                />

                <img
                  src={image}
                  alt=""
                  className="w-14     px-2    object-contain"
                />
              </div>

              {errors.card_number && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.card_number}
                </p>
              )}
            </div>

            <div className="flex justify-between gap-4">
              <div className="mb-4">
                <label
                  htmlFor="expiration_date"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Expiration Date
                </label>

                <DatePicker
                  selected={new Date()}
                  onChange={handleDateChange}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
                {errors.expiration_date && touched.expiration_date && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.expiration_date}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="cvv"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  id="cvv"
                  maxLength={3}
                  placeholder="CVV  "
                  onChange={handleCvvNumber}
                  onBlur={handleBlur}
                  value={values.cvv}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
                {errors.cvv && touched.cvv && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4 text-center">
              <button
                disabled={isPending}
                type="submit"
                className="w-full py-3 rounded-full mt-4 bg-[#4E007A] text-white cursor-pointer transition duration-300"
              >
                {isPending ? <MiniLoader /> : "Add New Payment Method"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFeaturedCart;
