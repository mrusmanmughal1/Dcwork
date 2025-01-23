import { useEffect, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";

import { useCandidateManageProfile } from "../../Services/Candidate/CandidateManageProfile";
import MiniLoader from "../../UI/MiniLoader";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { FaRegFileWord } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useUserinfo } from "../../Context/AuthContext";
import { GrUpload } from "react-icons/gr";
import { FiSend } from "react-icons/fi";
import parse from "../../assets/parse.png";
const CandidatesCvManagment = ({
  cvs = {},
  errors,
  cvparse,
  parseloading,
  setFieldValue,
  touched,
}) => {
  const [cvtitle, setcvtitle] = useState({
    cv_file_title: cvs[0]?.cv_title || "",
    // cv_file2_title: cvs[1]?.cv_title || "",
    // cv_file3_title: cvs[2]?.cv_title || "",
  });

  useEffect(() => {
    setcvtitle({
      cv_file_title: cvs[0]?.cv_title || "",
    });
  }, [cvs]);
  const { mutate: DeleteCV, isPending: DeletePending } =
    useCandidateManageProfile();
  const [deleteid, setdeleteid] = useState();
  const {
    mutate: updateProfile,
    isPending,
    isError: errorProfile,
  } = useCandidateManageProfile();
  const { user_id } = useUserinfo();
  const [id, setid] = useState();
  // handle single delete cv
  const handleSingleCVDelete = (e, type) => {
    setdeleteid(type);
    DeleteCV(
      {
        delete_cv_files: type,
      },
      {
        onSuccess: () => {
          setdeleteid(null);
        },
      }
    );
  };

  const handlecvname = (e) => {
    e.preventDefault();
    const update = {
      cv_file_title: cvtitle.cv_file_title,
    };
    updateProfile(update);
  };
  //handle single upload cv

  const handleSIngleUpdateCv = (e) => {
    const newFile = e.currentTarget.files[0]; // Get the file directly from the event

    if (!newFile) return; // Check if a file was selected

    // Check if the file is a PDF or Word document
    const validFileTypes = ["application/pdf"];
    if (!validFileTypes.includes(newFile.type)) {
      toast.error("Please upload a valid PDF.");
      return;
    }
    // Check if cvs is empty
    if (cvs?.length === 0) {
      const formData = new FormData();
      formData.append("cv_file", newFile);
      updateProfile(formData);
      return;
    }

    let cvFileExists = false; // Flag for cv_file existence
    let cvFile1Exists = false;
    let cvFile2Exists = false;

    for (let i = 0; i < cvs?.length; i++) {
      const cv = cvs[i];

      // Check if cv_file exists
      if (cv?.cv_type === "cv_file") {
        cvFileExists = true;
      }

      // Check if cv_file_1 exists
      if (cv.cv_type === "cv_file_2") {
        cvFile1Exists = true;
      }
      // Check if cv_file_1 exists
      if (cv.cv_type === "cv_file_3") {
        cvFile2Exists = true;
      }
    }

    const formData = new FormData();

    if (!cvFileExists) {
      formData.append("cv_file", newFile);

      updateProfile(formData);
    }
    // Determine which key to use based on the existence of files
    if (cvFileExists && !cvFile1Exists) {
      // If cv_file exists and cv_file_1 does not, upload as cv_file_1
      formData.append("cv_file2", newFile);

      updateProfile(formData);
    } else if (cvFileExists && cvFile1Exists) {
      // If both cv_file and cv_file_1 exist, upload as cv_file_2
      formData.append("cv_file3", newFile);

      updateProfile(formData);
    }
  };

  const handleParseCV = (id) => {
    setid(id);
    cvparse(
      { profileid: user_id, cvIndex: id },
      {
        onSuccess: () => setid(""),
      }
    );
  };
  return (
    <div>
      <div className="  pb-2">
        <div className="">
          Your Resume &nbsp;
          {/* <span className="text-xs font-normal  ">(Upload Upto 3 Resumes)</span> */}
        </div>
      </div>
      <div
        className={`border rounded-md   p-2 ${
          errors.cvs && touched.cvs ? "border-red-500 " : ""
        }`}
      >
        <div className="flex flex-col md:flex-row gap-3 ">
          {cvs?.length < 3 && (
            <div
              className={`flex justify-center items-center  order-1 ${
                cvs?.length > 0
                  ? " w-full     border-r md:border-none"
                  : "w-full"
              } `}
            >
              {isPending ? (
                <MiniLoader color="p-4 border-purple-500" />
              ) : (
                <div className="space-y-2 w-full">
                  {cvs.length > 0 && (
                    <div className="w-full">
                      <p className="">Cv Title</p>

                      <div className="flex items-center gap-2 w-full">
                        <div className="w-full">
                          <input
                            maxLength={10}
                            type="text"
                            placeholder=" Cv Title"
                            className=" p-1 w-full border"
                            onChange={(event) =>
                              setcvtitle({
                                ...cvtitle,
                                cv_file_title: event.target.value,
                              })
                            }
                            value={cvtitle?.cv_file_title}
                          />
                        </div>
                        <button
                          onClick={handlecvname}
                          className="bg-btn-primary hover:bg-purple-900 text-white rounded-md p-2"
                        >
                          <FiSend />
                        </button>
                      </div>
                    </div>
                  )}
                  {cvs.length == 0 ? (
                    <div className=" bg-gray-200 p-2  hover:bg-gray-100 text-white shadow-md flex flex-col justify-center items-center rounded-md">
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        accept=".pdf"
                        onChange={(e) => handleSIngleUpdateCv(e)}
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center hover:cursor-pointer"
                      >
                        <GrUpload className="text-2xl text-black" />
                        <p className="text-xs   text-black">
                          Upload Your Resume (PDF Only)
                        </p>
                      </label>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          )}
          {cvs?.length > 0 && (
            <div
              className={`flex   flex-col   justify-center gap-2        ${
                cvs?.length < 3 ? " w-full " : "w-full"
              } `}
            >
              {/* resume  */}
              {cvs?.map((val, i) => {
                const fileExtension = val?.file.split(".").pop().toLowerCase();
                return (
                  <div
                    key={i}
                    className=" text-white px-2 inline-block relative w-full  "
                  >
                    {cvs?.length > 0 && (
                      <div className=" text-black flex px-2 justify-between   w-full items-center shadow bg-gray-100 font-semibold relative   p-2">
                        <div className="flex  justify-center items-center">
                          <div className=" text-center flex items-center gap-2">
                            {fileExtension === "pdf" ? (
                              <FaRegFilePdf className="text-4xl" />
                            ) : (
                              <FaRegFileWord />
                            )}
                            <p>{cvs[0]?.cv_title?.slice(0, 15)}</p>
                          </div>
                        </div>
                        <div className="  flex        items-center rounded-full h-10  ">
                          <button
                            type="button"
                            data-tooltip-id="Delete"
                            onClick={(e) =>
                              handleSingleCVDelete(e, val.cv_type)
                            }
                            className=" flex items-center  text-black "
                          >
                            {deleteid == val.cv_type && DeletePending ? (
                              <MiniLoader color="border-purple-500" />
                            ) : (
                              <div className="bg-red-600 hover:bg-red-900 rounded-md p-1 text-white">
                                <MdDeleteOutline className="text-2xl    hover:cursor-pointer" />
                              </div>
                            )}
                          </button>
                          <button
                            type="button"
                            
                            onClick={() => handleParseCV(val.cv_id)}
                            disabled={parseloading}
                            data-tooltip-id="parse"
                          >
                            {parseloading && val.cv_id == id ? (
                              <div className="mx-4">
                                <MiniLoader />
                              </div>
                            ) : (
                              <div className="bg-btn-primary  w-8 overflow-hidden  hover:bg-purple-800  mx-2 p-1 text-white rounded-md ">
                                <img src={parse} alt="parse"   />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {errors.cvs && touched.cvs && (
        <div className="font-semibold text-red-700">{errors?.cvs}</div>
      )}

      <ReactTooltip
        id="parse"
        place="bottom"
        content="Parse Data From Resume  "
      />
      <ReactTooltip id="Delete" place="bottom" content="Delete Resume" />
    </div>
  );
};

export default CandidatesCvManagment;
