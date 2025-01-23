import { useEmployerDetails } from "../../Services/Employer/useEmployerDetails";

const useEmployerValidation = () => {
  // Fetch employer details
  const {
    data: employerData,
    isError: employerError,
    isLoading: loadingEmployer,
  } = useEmployerDetails();

  // Destructure employer data
  const {
    license_number,
    address_1,
    country,
    email,
    company_name,
    company_size,
    about,
    website,
    focused_industries,
    license_image,
    phone,
    city,
    last_name,
    first_name,
  } = employerData?.data?.data || {};

  // Define required fields
  const requiredFields = [
    license_number,
    address_1,
    country,
    email,
    company_name,
    company_size,
    about,
    website,
    focused_industries,
    license_image,
    phone,
    city,
    last_name,
    first_name,
  ];

  // Check if all required fields are present
  const employerAllData = requiredFields.every((field) => field);

  return {
    employerAllData,
    employerError,
    loadingEmployer,
  };
};

export default useEmployerValidation;
