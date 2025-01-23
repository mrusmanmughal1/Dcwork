import moment from "moment";
import * as Yup from "yup";
// login
export const LoginSchema = Yup.object({
  email: Yup.string().email().required("Enter Your E-mail !"),
  password: Yup.string().required("Please Enter Your Password !"),
});

export const Updatepassword = Yup.object({
  old_password: Yup.string().required("Old Password is Required"),
  new_password: Yup.string()
    .min(8, "Password must be at least 8 characters") // Minimum length
    .max(15, "Maximum 15 characters allowed")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
    .matches(/[0-9]/, "Password must contain at least one number") // At least one number
    .matches(/[\W_]/, "Password must contain at least one special character") // At least one special character
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .test("no-spaces", "Password cannot contain spaces", (value) => {
      return !/\s/.test(value);
    })
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Password must match")
    .required("Confirm Password is required"),
});
// Registration
export const RegisterSchema = Yup.object({
  account_type: Yup.string().required("Please Select Account Type !"),
  username: Yup.string()
    .min(4)
    .max(15)
    .test("no-spaces", "Username cannot contain spaces", (value) => {
      return !/\s/.test(value);
    })
    .required("Enter Your User Name  !"),

  email: Yup.string()
    .email("Enter a valid Email")
    .matches(
      /^[A-Za-z0-9]+([A-Za-z0-9.]*[A-Za-z0-9])?@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,64}$/,
      "Enter a valid Email"
    )
    .max(50, "Cannot exceed more than 50 characters")
    .required("Please Enter Your Email!"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters") // Minimum length
    .max(15, "Maximum 15 characters allowed")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
    .matches(/[0-9]/, "Password must contain at least one number") // At least one number
    .matches(/[\W_]/, "Password must contain at least one special character") // At least one special character
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .test("no-spaces", "Password cannot contain spaces", (value) => {
      return !/\s/.test(value);
    })
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password must match")
    .required("Confirm Password is required"),
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters") // Add minimum length validation
    .max(50, "First name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .required("Please enter your first name"),
  last_name: Yup.string()
    .min(2, "Last name must be at least 50 characters") // Add minimum length validation
    .max(50, "Last name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .required("Please enter your Last name"),
  phone: Yup.string().required("Please enter a valid phone number!"),
  // .test("is-valid-phone", "Invalid phone number", (value) => {
  //   // Use the react-phone-input-2 isValid function to validate the phone number
  //   return PhoneInput.isValid(value);
  // }),
});

// Employer Job Posting
export const JobPost = Yup.object().shape({
  contract_type: Yup.string().required("Contract type is required"),
  title: Yup.string()
    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .min(4, "Must be at least 4 characters")
    .max(35, "Title cannot exceed 35 characters")
    .required("Job title is required"),

  remote: Yup.boolean().required(),
  hybrid: Yup.boolean(),
  rate_unit: Yup.string().required("Please Select Job Rate "),
  rate: Yup.number()
    .required("Rate is required")
    .integer("Rate must be an integer") // Ensures that rate must be an integer
    .positive("Rate must be a positive number")
    .test("len", "Rate must be under 8 digits", (value) => {
      return value ? value.toString().length < 8 : false;
    }), // Optionally ensure it's po
  skill_level: Yup.string().required("Select  Your  Experience "),
  job_description: Yup.string()
    // Automatically trims leading and trailing spaces
    .matches(/^(?!\s)/, "Job description can't start with a space")
    .max(5000, " can't be more than 5000 characters")
    .required("Job description is required"),
  work_authorization: Yup.array()
    .of(Yup.string())
    .max(10, "You can provide a maximum of 10 work authorizations")
    .required("Please Provide Work Authorizations"),
  job_skill: Yup.array()
    .of(Yup.string().required("Skill cannot be empty"))
    .min(1, "Please provide at least one job skill")
    .required("Please provide job skills"),

  focused_industries: Yup.array()
    .of(Yup.string())
    .min(1, "Please provide at least one Industry")
    .max(10, "Maximum 10 Industries are allowed ") // Ensure at least one Industries is selected
    // Ensure at least one Industries is selected
    .required("Please provide Industries"),
  job_posting_deadline: Yup.date()
    .required("Job posting deadline is required")
    .min(new Date(), "Deadline must be in the future")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      "Deadline must be within one year from today"
    ),

  addresses: Yup.array()
    .of(
      Yup.object().shape({
        state: Yup.string().required("Add State"),
        country: Yup.string().required("Add country"),

        city: Yup.string().required("Add City"),
        zip_code: Yup.string()
          .matches(/^[A-Za-z0-9\s]*$/, "Only Letters and Numbers are allowed")

          .required("Add Zip Code"),
      })
    )
    .when("remote_work", {
      is: false,
      then: (schema) => schema.min(1, "At least one address is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

// forget Password
export const ForgetPasswordSchema = Yup.object({
  email: Yup.string().email().required("Please Enter Your Email !"),
});

//  ----------------------------------  Manage Profile candidate --------------------------//
const today = new Date();
const minimumAge = new Date(today.setFullYear(today.getFullYear() - 15));
export const CandiateStep1Validation = Yup.object({
  cvs: Yup.array().min(1, "Upload Resume ").required("Cv  is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  first_name: Yup.string()
    .min(3, "Must be at least 3 characters") // Add minimum length validation
    .max(20, "Cannot exceed 20 characters")
    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .required("Please enter your first name"),

  last_name: Yup.string()
    .min(3, "Must be at least 3 characters") // Add minimum length validation
    .max(15, "Cannot exceed 15 characters")
    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .required("Please enter your Last name"),
  gender: Yup.string()
    .oneOf(["male", "female", "other", "not_to_disclose"], "Invalid gender")
    .required("Gender is required"),
  date_of_birth: Yup.date()
    .required("Date of Birth is required")
    .max(minimumAge, "You must be at least 15 years old"),
});

export const CandiateStep2Validation = Yup.object({
  address_1: Yup.string()
    .max(60, "Cannot exceed 60 characters")
    .matches(/^[^\s].*$/, "No spaces at the beginning")
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Address 1 is required"),
  address_2: Yup.string()
    .matches(/^[^\s].*$/, "No spaces at the beginning")
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )

    .max(60, "Cannot exceed 60 characters"),

  city: Yup.string()
    .max(30, "Cannot exceed 30 characters")

    .required("City is required"),
  state: Yup.string()
    .max(30, "Cannot exceed 30 characters")

    .required("State is required"),
  country: Yup.string().required("Country is required"),
  zip_code: Yup.string()
    .max(16, "Cannot exceed 16 characters")
    .matches(/^[A-Za-z0-9\s]*$/, "Only Letters and Numbers are allowed")

    .required("Enter Your Zip Code"),
  phone: Yup.string().required("Please enter a valid phone number!"),
});
// images format
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp", // Bitmap image
  "image/tiff", // Tagged Image File Format
  "image/svg+xml", // Scalable Vector Graphics (SVG)
  "image/heif", // High Efficiency Image Format (HEIF)
  "image/heic", // High Efficiency Image Coding (HEIC)
  "image/avif", // AV1 Image File Format (AVIF)
];
export const CandiateStep3Validation = Yup.object({
  exp_level: Yup.string().required("Select Your Experience"),

  about: Yup.string()
    .max(1000, "About section can't be more than 1000 characters")
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )

    .required("About is required"),
  job_profession: Yup.string()
    .max(35, " Only 35 characters  Allowed ")
    .matches(/^[A-Za-z0-9\s]*$/, " Only  letters and numbers are allowed ")
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Add Job Title "),
  professional_skill: Yup.array()
    .of(Yup.string())

    .min(1, "Please provide at least one value") // Ensure at least one Industries is selected
    .required("Please provide value"),
  focused_industries: Yup.array()
    .min(1, "Please provide at least one industry")
    .max(10, "Maximum 10 Industries Allowed") // Ensures at least 1 item in the array
    .required("Please provide value"),

  avatar_image: Yup.mixed()
    .test(
      "is-url-or-file",
      "Unsupported file format.or Image size should not exceed 5MB.",
      (value) => {
        if (!value) return true;
        if (typeof value === "string") {
          return true;
        }
        if (value && value.type) {
          const isValidFormat = SUPPORTED_FORMATS.includes(value.type);
          const isValidSize = value.size <= 5 * 1024 * 1024; // 5 MB

          if (!isValidFormat) {
            return new Yup.ValidationError(
              "Unsupported file format. Allowed formats are JPEG, PNG, GIF, and WEBP.",
              value,
              "avatar_image"
            );
          }
          if (!isValidSize) {
            return new Yup.ValidationError(
              "File size exceeds 5MB limit. Please upload a smaller image.",
              value,
              "avatar_image"
            );
          }

          return isValidFormat && isValidSize;
        }

        return false; // If it's neither a valid URL nor a valid file, return false
      }
    )
    .required("Please add your image  "), // Now we ensure this only runs if the value isn't empty
});

export const CandidateEducation = Yup.object({
  education_level: Yup.string().required("Education level is required"),
  institute_name: Yup.string()
    .max(60, "Only 60 characters  Allowed ")
    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
      "Must only contain letters, numbers,  (no spaces at the beginning)"
    )

    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Institute name is required"),
  location: Yup.string()
    .max(100, " only 100 characters  Allowed ")
    .matches(
      /^[A-Za-z0-9\s\-\/\#\+\_\(\)]+$/,
      " No spaces at the beginning & No Invalid Characters Allowed"
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Location is required"),
});
export const ExpeirencCandidate = Yup.object({
  job_title: Yup.string()
    .max(35, "Only 35 characters  Allowed ")

    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
      "Must only contain letters, numbers (no spaces at the beginning)"
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Job Title is required"),
  job_description: Yup.string()
    .max(200, "Only 200 characters  Allowed ")

    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
      "Must only contain letters, numbers, (no spaces at the beginning)"
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Job Description  is required"),
  company_name: Yup.string()
    .max(35, "Only 35 characters  Allowed ")

    .matches(
      /^[A-Za-z0-9][A-Za-z0-9\s]*$/,
      "Must only contain letters, numbers,(no spaces at the beginning)"
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )

    .required("Company Name is required"),
  date_from: Yup.date()
    .required("Start Date is required")
    .max(new Date(), "Start Date cannot be in the future"),

  date_to: Yup.date().when("is_current", {
    is: false, // Only validate if is_current is false
    then: () =>
      Yup.date()
        .required("End Date is required")
        .max(new Date(), "End Date cannot be more than today's date")
        .test(
          "is-greater-than-start",
          "End Date must be greater than or equal to Start Date",
          function (value) {
            const { date_from } = this.parent; // Get the value of date_from
            if (!value || !date_from) return true; // Skip validation if either date is not provided
            return value >= date_from; // Ensure date_to is greater than or equal to date_from
          }
        ),
    otherwise: () => Yup.date().nullable(), // If is_current is true, date_to can be null
  }),

  is_current: Yup.boolean(),
});
export const CertificateCandidate = Yup.object({
  certificate_name: Yup.string()
    .max(35, "Only 35 characters  Allowed ")

    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
      "Must only contain letters, numbers, and spaces (no spaces at the beginning)"
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )

    .required("Certificate Name is required"),
  issuing_organization: Yup.string()
    .max(35, "Only 35 characters  Allowed ")

    .matches(
      /^[a-zA-Z0-9][a-zA-Z0-9 ]*$/,
      "Must only contain letters, numbers, and spaces (no spaces at the beginning)"
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )

    .required("Organization Name is required"),
  date_of_issue: Yup.date()
    .required("Date issued is required")
    .max(new Date(), "Date issued cannot be in the future"),
});
// candidate password
export const ManagePasswordCandidate = Yup.object({
  new_password: Yup.string()
    .min(8, "Password must be at least 8 characters") // Minimum length
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
    .matches(/[0-9]/, "Password must contain at least one number") // At least one number
    .matches(/[\W_]/, "Password must contain at least one special character") // At least one special character
    .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("new_password"), null],
    "Passwords must match"
  ),
});

// -------------------------- manage profile employer ------------------------------ ///
// Step No 1 validation
export const EmpStep1Validation = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  first_name: Yup.string()
    .matches(
      /^[a-zA-Z][a-zA-Z]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .max(50, "  only contains 50  characters")
    .required("First Name is required"),
  last_name: Yup.string()
    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .max(50, "  only contains 50  characters")

    .required("Last Name is required"),

  address_1: Yup.string()
    .max(200, "only 200 characters  Allowed")
    .min(10, "Atlease 10 characters  Required")
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Address 1 is required")
    .matches(/^[^\s].*$/, "No spaces at the beginning"),

  address_2: Yup.string()
    .matches(/^[^\s].*/, "Address 2 cannot start with a space")
    .min(10, "Atlease 10 characters  Required")

    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    ) // Ensure no spaces at the beginning
    .max(200, "Address 2 cannot exceed 200 characters"),
});
// Step No 2 validation
export const EmpStep2Validation = Yup.object({
  zip_code: Yup.string()
    .matches(/^[^\s].*$/, "No spaces at the beginning")
    .matches(/^[A-Za-z0-9\s]*$/, "Only Letters and Numbers are allowed")

    .max(16, "Only 16 characters  Allowed ")

    .required("Zip Code is required"),
  city: Yup.string()
    .max(16, "Only contains 16  characters")
    .required("City is required"),
  country: Yup.string().required("Country is required"),
  phone: Yup.string().required("Please enter a valid phone number!"),
  state: Yup.string()
    .max(35, "Only 35 characters  Allowed ")

    .required("State is required"),
});
// Step No 3 validation
export const EmpStep3Validation = Yup.object({
  about: Yup.string()
    .max(1000, "About section can't be more than 1000 characters")
    .min(10, "Atlease 10 characters  Required")
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )
    .required("Enter Details About Your Company"),
  license_number: Yup.string()
    .max(16, "License Number only contains 16 characters")
    .min(7, "License Number Must be Atleast  7 characters") // Maximum length
    // Maximum length
    .matches(
      /^[a-zA-Z0-9-]*$/,
      "License Number can only contain alphanumeric characters and hyphens"
    ) // Allow alphanumeric and hyphens
    .matches(/^[^\s].*$/, "License Number cannot start with a space") // License Number cannot start with a space
    .required("License Number is required"),
  company_size: Yup.string().required("Company size is required"),
  focused_industries: Yup.array()
    .min(1, "Please Add Your Targeted Industries") // Ensure at least one value is selected
    .required("Please Add Your Targeted Industries"),
  company_name: Yup.string()
    .min(1, "Must be at least 1 characters") // Add minimum length validation
    .max(50, "Cannot exceed more then  50 characters")
    .matches(
      /^[a-zA-Z0-9]+(?:[\s-][a-zA-Z0-9]+)*$/,
      "Company Name can only contain alphanumeric  can't start or end with a space."
    )
    .test(
      "contains-letter",
      "Only Numeric Value is not allowed",
      (value) => /[a-zA-Z]/.test(value) // This checks if at least one letter exists
    )

    .required("Please enter your Company  name"),
  website: Yup.string()

    .url("Enter a valid website URL") // Checks if the string is a valid URL
    .max(50, "Cannot exceed more then  50 characters")
    .required("Enter Your Website"),
  license_image: Yup.string().required("Attach Your Lisence Document (PDF)"),
  avatar_image: Yup.mixed()
    .test(
      "is-url-or-file",
      "JPEG, PNG, GIF, or WEBP Format Allowed.",
      (value) => {
        if (!value) return false; // No file or URL provided, return false for validation

        // Check if the value is a string (i.e., a URL)
        if (typeof value === "string") {
          // Regex to match the allowed image file extensions at the end of the URL
          const validUrlPattern = /\.(jpeg|jpg|png|gif|webp|jfif)$/i; // Case-insensitive

          // If the string does not match one of the valid extensions, show an error
          if (!validUrlPattern.test(value)) {
            return new Yup.ValidationError(
              "JPEG, PNG, GIF, or WEBP Format Allowed.",
              value,
              "avatar_image"
            );
          }

          return true; // URL validation passed
        }

        // If it's a file (not a URL), proceed to file type and size validation
        if (value && value.type) {
          const isValidSize = value.size <= 5 * 1024 * 1024; // 5 MB

          // Validate file size
          if (!isValidSize) {
            return new Yup.ValidationError(
              "File size exceeds 5MB limit. Please upload a smaller image.",
              value,
              "avatar_image"
            );
          }

          // Check if the file type is valid
          const validImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/jfif",
          ];
          if (!validImageTypes.includes(value.type)) {
            return new Yup.ValidationError(
              "Unsupported file format. Please upload an image of type JPEG, PNG, GIF, or WEBP.",
              value,
              "avatar_image"
            );
          }

          return true; // File validation passed
        }

        return false; // If it's neither a string URL nor a file, validation fails
      }
    )
    .required("Please Add Your Company Image"),
});
// Emp Password manage
export const ManageEmployerPassword = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters") // Minimum length
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
    .matches(/[a-z]/, "Password must contain at least one lowercase letter") // At least one lowercase letter
    .matches(/[0-9]/, "Password must contain at least one number") // At least one number
    .matches(/[\W_]/, "Password must contain at least one special character"), // At least one special character

  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Passwords must match"
  ),
});

// Interview Module

export const upateINterview = Yup.object({
  interview_date: Yup.date()
    .required("Select a date")
    .min(new Date(), "Date must be in the future")
    .test("future-date", "Date must be in the future", (value) => {
      return moment(value).isAfter(moment()); // Ensure that the date is after the current moment
    }),
  date_time_start: Yup.string().required("Start time is required"),
  date_time_end: Yup.string()
    .required("End time is required")
    .test(
      "end-after-start",
      "End time must be after start time",
      function (value) {
        const { date_time_start } = this.parent; // Getting start time from the form
        if (date_time_start && value) {
          return moment(value, "HH:mm").isAfter(
            moment(date_time_start, "HH:mm")
          );
        }
        return true; // Validation passes if no start time or end time
      }
    ),
});
export const IntervireOnCall = Yup.object({
  interview_type: Yup.string().required("Select Interview Type required"),
  interviewer_name: Yup.string()
    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .max(25, "Cannot exceed more than 25 characters")
    .required("Enter Interviewer Name"),
  interviewer_phone: Yup.string().required(
    "Please enter a valid phone number!"
  ),
  interview_date: Yup.date()
    .required("Select A Date")
    .min(new Date(), "Date must be in the future"),

  // Start time validation
  date_time_start: Yup.string()
    .required("Please select a start time")
    .test("valid-time", "Please enter a valid start time", (value) => {
      return value && /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(value);
    }),

  date_time_end: Yup.string()
    .required("Please select an end time")
    .test("valid-time", "Please enter a valid end time", (value) => {
      return value && /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(value); // Check valid time format
    })
    .test(
      "end-time-after-start-time",
      "End time must be after start time",
      function (value) {
        const { date_time_start } = this.parent; // Access the start time field value
        if (date_time_start && value) {
          const [startHour, startMinute] = date_time_start
            .split(":")
            .map(Number);
          const [endHour, endMinute] = value.split(":").map(Number);

          // Convert start and end times into minutes and compare
          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute;

          return endTimeInMinutes > startTimeInMinutes;
        }
        return true;
      }
    )
    .test(
      "end-time-future",
      "End time must be in the future",
      function (value) {
        const currentTime = new Date();
        if (value) {
          const [endHour, endMinute] = value.split(":").map(Number);
          const endTime = new Date(currentTime);
          endTime.setHours(endHour, endMinute, 0, 0);

          return endTime > currentTime; // Check if end time is in the future
        }
        return true;
      }
    ),
});

export const InterviewOnVideos = Yup.object({
  interview_type: Yup.string().required("Select Interview Type required"),
  interviewer_name: Yup.string()

    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .max(25, "Cannot exceed more then  25 characters")
    .required("Enter Interviewer Name"),
  video_meeting_link: Yup.string()
    .required("Enter Meeting Link")
    .url("Enter a valid URL"),

  interview_date: Yup.date()
    .required("Select A Date")
    .min(new Date(), "Date must be in the future"),
  // Ensure end date is after the start date
  date_time_start: Yup.string()
    .required("Please select a start time")
    .test("valid-time", "Please enter a valid start time", (value) => {
      return value && /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(value);
    }),

  date_time_end: Yup.string()
    .required("Please select an end time")
    .test("valid-time", "Please enter a valid end time", (value) => {
      return value && /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(value); // Check valid time format
    })
    .test(
      "end-time-after-start-time",
      "End time must be after start time",
      function (value) {
        const { date_time_start } = this.parent; // Access the start time field value
        if (date_time_start && value) {
          const [startHour, startMinute] = date_time_start
            .split(":")
            .map(Number);
          const [endHour, endMinute] = value.split(":").map(Number);

          // Convert start and end times into minutes and compare
          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute;

          return endTimeInMinutes > startTimeInMinutes;
        }
        return true;
      }
    )
    .test(
      "end-time-future",
      "End time must be in the future",
      function (value) {
        const currentTime = new Date();
        if (value) {
          const [endHour, endMinute] = value.split(":").map(Number);
          const endTime = new Date(currentTime);
          endTime.setHours(endHour, endMinute, 0, 0);

          return endTime > currentTime; // Check if end time is in the future
        }
        return true;
      }
    ),
  // .min(Yup.ref("date_time_start"), "End time must be after the start time"),
});

export const IntervireOnsite = Yup.object({
  interview_type: Yup.string().required("Select Interview Type required"),
  interviewer_name: Yup.string()
    .matches(
      /^[a-zA-Z][a-zA-Z ]*$/,
      "Must only contain letters and no spaces at the beginning"
    )
    .max(25, "Cannot exceed more then  25 characters")
    .required("Enter Interviewer Name"),
  interviewer_phone: Yup.string().required(
    "Please enter a valid phone number!"
  ),

  location: Yup.string()
    .matches(/^[^\s].*$/, "No spaces at the beginning")
    .max(60, "Cannot exceed more then  60 characters")
    .required("Enter Location required"),

  interview_date: Yup.date()
    .required("Select A Date")
    .min(new Date(), "Date must be in the future"),
  date_time_start: Yup.string()
    .required("Please select a start time")
    .test("valid-time", "Please enter a valid start time", (value) => {
      return value && /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(value);
    }),

  date_time_end: Yup.string()
    .required("Please select an end time")
    .test("valid-time", "Please enter a valid end time", (value) => {
      return value && /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(value); // Check valid time format
    })
    .test(
      "end-time-after-start-time",
      "End time must be after start time",
      function (value) {
        const { date_time_start } = this.parent; // Access the start time field value
        if (date_time_start && value) {
          const [startHour, startMinute] = date_time_start
            .split(":")
            .map(Number);
          const [endHour, endMinute] = value.split(":").map(Number);

          // Convert start and end times into minutes and compare
          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute;

          return endTimeInMinutes > startTimeInMinutes;
        }
        return true;
      }
    )
    .test(
      "end-time-future",
      "End time must be in the future",
      function (value) {
        const currentTime = new Date();
        if (value) {
          const [endHour, endMinute] = value.split(":").map(Number);
          const endTime = new Date(currentTime);
          endTime.setHours(endHour, endMinute, 0, 0);

          return endTime > currentTime; // Check if end time is in the future
        }
        return true;
      }
    ),
});

//contact Us form validation schema
export const ContatUs = Yup.object({
  name: Yup.string().required("Enter Your Name"),
  email: Yup.string()
    .email("Invalid email address")

    .required("Email is required"),
  subject: Yup.string().required("Enter Subject"),
  description: Yup.string().required(" Enter Your Message"),
});

// new card Schema

export const NewMethodCard = Yup.object({
  card_number: Yup.string()
    .required("Card number is required")
    .matches(
      /^(4|5|34|6011|644|645|646|647|648|649)/, // Match valid card prefixes
      "Card number must start with a valid prefix (4, 5, 34, 6011, 644, 645, 646, 647, 648, 649)"
    )
    .test(
      "invalid-prefix",
      "Card number cannot start with 1, 2, 8, 9,  etc.",
      (value) => {
        return !/^[129]/.test(value.charAt(0)); // Check if it starts with 1, 2, 9
      }
    )
    .test(
      "length-check",
      "Card number must be 15 digits if it starts with 3, otherwise 16 digits",
      (value) => {
        if (!value) return true; // Skip validation if no value

        const firstDigit = value.charAt(0);
        // If the card starts with '3' (e.g., American Express), it must have 15 digits
        if (firstDigit === "3") {
          return value.length === 15;
        }
        // Otherwise, the card should have 16 digits
        return value.length === 16;
      }
    )
    .required("Card number is required"),

  expiration_date: Yup.string()
    .required("Expiration date is required")
    .test(
      "is-future-date",
      "Expiration date must be in the future",
      function (value) {
        // Convert the month value (YYYY-MM) into a Date object
        const [year, month] = value.split("-");
        const expirationDate = new Date(year, month - 1); // month - 1 since JS months are 0-based
        return expirationDate > new Date(); // check if the expiration date is in the future
      }
    ),
  cvv: Yup.string()
    .required("CVV is required")
    .min(3, "Minimum 3 digits")
    .matches(/^\d{3}$/, "CVV must be 3 digits"),
});
