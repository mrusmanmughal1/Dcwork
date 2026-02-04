import { useUserinfo } from "../../Context/AuthContext";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import { CANDIDATE } from "../../utils/Constants";

const useCandidateValidation = () => {
  // Fetch candidate details
  const {
    data: candidateData,
    isLoading: loadingCandidate,
    isError: candidateError,
  } = useCandidateDetails();

  // Destructure candidate data
  const {
    cvs,
    username,
    first_name,
    last_name,
    phone,
    dob,
    candidate_professional_skill,
    candidate_avatar_image,
    candidate_exp_level,
    candidate_country,
    candidate_about,
    candidate_city,
    candidate_address_1,
    candidate_job_profession,
  } = candidateData?.data?.data || {};

  // Define required fields
  const requiredFields = [
    username,
    first_name,
    last_name,
    phone,
    dob,
    cvs?.length > 0,
    candidate_professional_skill,
    candidate_avatar_image,
    candidate_exp_level,
    candidate_country,
    candidate_about,
    candidate_city,
    candidate_address_1,
    candidate_job_profession,
  ];
  // Check if all required fields are present
  const candidateAllData = requiredFields.every((field) => field);

  return {
    candidateAllData,
    candidateError,
    loadingCandidate,
  };
};

export default useCandidateValidation;
