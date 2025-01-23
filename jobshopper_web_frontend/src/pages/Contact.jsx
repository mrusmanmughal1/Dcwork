import { useFormik } from "formik";
import contact from "../assets/contact-us.png";
import { ContatUs } from "../helpers/Schema/FormValidation";
import { useLeaveMessage } from "../Services/General/useLeaveMessage";
import MiniLoader from "../UI/MiniLoader";

const Contact = () => {
  const { mutate: sendMessage, isPending } = useLeaveMessage();
  const initialValues = {
    name: "",
    email: "",
    subject: "",
    description: "",
  };

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;
    if (name === "name") {
      const regex = /^[A-Za-z\s]*$/; // Only letters and spaces allowed
      // Prevent space at the beginning or disallowed characters
      if (
        (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) ||
        !regex.test(e.key)
      ) {
        e.preventDefault(); // Block the space at the beginning and disallowed characters
      }
    }
    if (name === "email") {
      const regex = /^[A-Za-z0-9@._-]*$/; // Email valid characters
      // Prevent space and disallowed characters
      if (e.key === " " || !regex.test(e.key)) {
        e.preventDefault(); // Block spaces and disallowed characters
      }
    }
    if (name === "subject") {
      const regex = /^[A-Za-z0-9\s]*$/; // Alphanumeric and spaces allowed
      // Prevent disallowed characters
      if (!regex.test(e.key)) {
        e.preventDefault(); // Block disallowed characters
      }
    }

    if (name === "description") {
      // Prevent space at the beginning of the interviewer name input field
      if (
        input.selectionStart === 0 &&
        (e.key === " " || e.keyCode === 32 || e.key === "<p>&nbsp;</p>")
      ) {
        e.preventDefault(); // Block the space from being typed at the beginning
      }
    }
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues,
    onSubmit: (values, action) => {
      sendMessage(values, {
        onSuccess: () => resetForm(),
      });
      // Reset the form after successful job posting
    },
    validationSchema: ContatUs,
  });
  return (
    <div className="px-4 md:px-8  ">
      <div className="mt-8 lg:mt-10">
        <h1 className="text-4xl font-semibold text-center lg:text-center">
          Contact <span className="text-[#4E007A]">Us</span>
        </h1>
      </div>
      <div className="w-[80%] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between mt-10 ">
          <div className="w-full lg:w-auto lg:max-w-md mx-auto lg:mx-0 lg:ml-[7rem] text-center">
            <h2 className="text-lg text-[#4E007A] font-semibold py-2">
              Address
            </h2>
            <h3 className="text-base font-semibold">Head Office:</h3>
            <p className="text-base py-1">140 N University Dr Coral Springs,</p>
            <p className="text-base py-1">FL 33071</p>
          </div>
          <div className="w-full lg:w-auto lg:max-w-md mx-auto text-center lg:mx-0 mr-4 lg:mr-[12rem]">
            <h2 className="text-lg text-[#4E007A] font-semibold py-2">
              E-mail
            </h2>
            <p className="text-base">info@jobsshopper.com</p>
          </div>
        </div>
        <div className="mt-8 md:mt-12 lg:mt-16 flex flex-col lg:flex-row items-start">
          <div className="lg:w-1/2 mx-auto  ">
            <h1 className="text-black text-4xl font-semibold">
              Leave a <span className="text-[#4E007A]">Message</span>
            </h1>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg pt-8 bg-white mt-8 md:mt-0 md:ml-4 lg:mt-0 lg:ml-0 lg:mr-[12rem]"
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  maxLength={40}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={validateInuts}
                  autoComplete="off"
                  value={values.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
                {errors.name && touched.name && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your email
                </label>
                <input
                  type="text"
                  name="email"
                  maxLength={60}
                  id="email"
                  onKeyDown={validateInuts}
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
                {errors.email && touched.email && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  autoComplete="off"
                  id="subject"
                  maxLength={50}
                  onKeyDown={validateInuts}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subject}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
                {errors.subject && touched.subject && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="mb-">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Your Message
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="5"
                  maxLength={200}
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={validateInuts}
                  value={values.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>
              {errors.description && touched.description && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.description}
                </p>
              )}
              <div className="mb-4 text-center">
                <button
                  disabled={isPending}
                  className="w-full py-3  mt-4 bg-[#4E007A] text-white rounded-md cursor-pointer transition duration-300"
                >
                  {isPending ? <MiniLoader /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
          <img
            src={contact}
            alt="Contact Us"
            className="lg:w-1/3 mt-8 lg:mt-0 mb-4 md:mb-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
