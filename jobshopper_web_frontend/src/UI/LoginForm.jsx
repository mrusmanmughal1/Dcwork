import { useFormik } from "formik";
import { LoginSchema } from "../helpers/Schema/FormValidation";
import { NavLink } from "react-router-dom";
import { useLogin } from "../Services/Login/useLogin";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import MiniLoader from "./MiniLoader";

const credentials = {
  email: "",
  password: "",
};

const LoginForm = ({ paddingMain, width, fontSize, set }) => {
  const { mutate: Login, isPending } = useLogin();
  const inputRef = useRef(null);
  const [showPassword, setshowPassword] = useState(false);
  useEffect(() => {
    // Focus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues: credentials,
      onSubmit: (values, action) => {
        Login(values);
      },
      validationSchema: LoginSchema,
    });
  const validateInuts = (e) => {
    const { name } = e.target;
    if (name === "email" || name === "password") {
      if (e.key === " " || e.keyCode === 32) {
        e.preventDefault();
      }
    }
  };
  return (
    <div className={`${paddingMain}    p-10 md:p-14 `}>
      <div
        className={`md:mx-auto ${width}  md:w-1/2   lg:w-1/2 xl:w-1/2 text-center flex flex-col justify-center  gap-6`}
      >
        <div className="font-bold text-[#4e007a] ">
          Existing Users Login Below
        </div>

        <form onSubmit={handleSubmit}>
          <div className=" flex flex-col gap-6">
            <div className="">
              <input
                className={`border p-3 font-bold w-full bg-slate-200  ${
                  errors.email && touched.email ? "border-red-600" : ""
                }`}
                placeholder=" Enter Email Address"
                name="email"
                id="email"
                onKeyDown={validateInuts}
                // ref={inputRef}
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && touched.email && (
                <p className="text-start px-1  text-sm font-semibold text-red-600">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="">
              <div className="relative">
                <div className="absolute hover:cursor-pointer right-4 top-1/3 ">
                  {showPassword ? (
                    <FaEyeSlash onClick={() => setshowPassword(false)} />
                  ) : (
                    <FaEye onClick={() => setshowPassword(true)} />
                  )}
                </div>
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  className={`border p-3 font-bold w-full bg-slate-200  ${
                    errors.password && touched.password ? "border-red-600" : ""
                  }`}
                  placeholder="Password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  onKeyDown={validateInuts}
                  onBlur={handleBlur}
                  value={values.password}
                />
              </div>
              {errors.password && touched.password && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.password}
                </p>
              )}
            </div>
          </div>
          <div className={`${fontSize} flex justify-between text-sm  py-4`}>
            <div className={` flex  items-center font-semibold   gap-2`}>
              <input type="checkbox" name="" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <div className=" font-semibold">
              <NavLink to="/forget-password" className="hover:text-btn-primary">
                <button
                  onClick={() => set(false)}
                  type="button"
                  disabled={isPending}
                >
                  Forgot Password?
                </button>
              </NavLink>
            </div>
          </div>
          <div className="flex    gap-4 justify-between">
            <div className="w-full text-start ">
              <button
                type="submit"
                disabled={isPending}
                className="font-bold bg-[#4e007a] disabled:cursor-not-allowed text-white border-btn-primary border-2     px-10  rounded-md py-2"
              >
                {isPending ? (
                  <div className="px-4">
                    <MiniLoader />
                  </div>
                ) : (
                  "LOGIN"
                )}
              </button>
            </div>
            <div className="w-full  text-end">
              <NavLink to="/register">
                <button
                  onClick={() => set(false)}
                  type="button"
                  disabled={isPending}
                  className=" text-[#4e007a] font-bold rounded-md   px-8   border-btn-primary border-2 py-2 hover:bg-black hover:text-white  transition-all hover:ease-in "
                >
                  REGISTER
                </button>
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
