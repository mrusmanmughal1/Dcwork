import { useEffect, useState } from "react";
import { useFOrgetPassword } from "../Services/ForgetPassword/useForgetPassword";
import { useFormik } from "formik";
import { ForgetPasswordSchema } from "../helpers/Schema/FormValidation";
import MiniLoader from "./MiniLoader";
import { useUserinfo } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const ForGetPassword = () => {
  const { auth } = useUserinfo();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth, navigate]);
  const { mutate: ForgetPassword, isPending, isError } = useFOrgetPassword();

  const initialValues = {
    email: "",
  };

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormik({
      initialValues,
      onSubmit: (values, action) => {
        ForgetPassword(values, {
          onSuccess: () => {
            resetForm();
          },
        });
      },
      validationSchema: ForgetPasswordSchema,
    });
  return (
    <div>
      <div className="h-96 flex justify-center items-center">
        <form className="space-y-10 gap-4 w-1/2 " onSubmit={handleSubmit}>
          <div className="text-center font-bold uppercase text-2xl text-btn-primary">
            Forgot Password ?
          </div>
          <div className="  g ">
            <div className="w-full flex gap-3">
              <input
                type="email"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                className={`w-full border rounded-sm  outline-purple-400  p-3 ${
                  isError && "border-red-900"
                }`}
                placeholder="Please Enter Your Email Here ! "
              />
              <button
                type="submit"
                className="bg-btn-primary w-48 text-white py-3 rounded-md"
              >
                {isPending ? (
                  <MiniLoader color="border-purple-600" />
                ) : (
                  " Send Email"
                )}
              </button>
            </div>

            {errors.email && touched.email && (
              <p className="text-start px-1  text-sm font-semibold text-red-600 capitalize">
                {errors.email}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForGetPassword;
