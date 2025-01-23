import { useEffect, useState } from "react";
import { BASE_URL } from "../../../config/Config";
import { BsUpload } from "react-icons/bs";
import MiniLoader from "../../../UI/MiniLoader";
import { IoDownloadOutline } from "react-icons/io5";
import axios from "axios";
import { useUserinfo } from "../../../Context/AuthContext";
import toast from "react-hot-toast";

const LisenceDocuments = ({
  values,
  errors,
  license_image,
  setFieldValue,
  touched,
}) => {
  const { user_id } = useUserinfo();

  const [res, setRes] = useState(null);
  const [pdfLoad, setPdfLoad] = useState(false);
  const { license_image: doc } = res?.data?.data || {};
  useEffect(() => {
    if (res?.data?.data) {
      setFieldValue("license_image", doc); // Update form field with valid doc
    } else {
      setFieldValue("license_image", values?.license_image); // Update form field with valid doc
    }
  }, [res]);
  const EmployerUpdate = async (file) => {
    const API = `${BASE_URL}api/manage-employer-profile/${user_id}/`;
    const token = localStorage.getItem("Token");

    try {
      const response = await axios.patch(API, file, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setRes(response); // Set the response data if needed
      toast.success("Document Uploaded Successfully");
      setPdfLoad(false); // Stop loader when done
    } catch (error) {
      //   console.error("Error uploading file:", error);
      setPdfLoad(false); // Stop loader on error
    }
  };
  const handleLicenseChange = (e) => {
    e.preventDefault();
    const file = e.currentTarget.files[0];
    if (file) {
      // Show loader before uploading
      setPdfLoad(true);

      if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("license_image", file);
        EmployerUpdate(formData);
      } else {
        alert("Please upload a valid PDF file.");
        setPdfLoad(false); // Stop loader if file is invalid
      }
    }
  };
  const handleDownload = (e) => {
    e.preventDefault();
    const url = BASE_URL + (doc ? doc : values.license_image);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "Document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <label htmlFor="license_image"> License Document*</label>
      </div>
      <div className={`  flex md:flex-row flex-col border ${errors.license_image && touched.license_image  ? "border-red-500" : ""} `}>
        <div className="relative w-full p-4 border-r">
          <div className="relative border">
            <button className="p-2 hover:text-btn-primary flex items-center gap-2">
              <input
                type="file"
                name="license_image"
                id="license_image"
                accept=".pdf"
                onChange={handleLicenseChange}
                className="absolute cursor-pointer h-full w-full opacity-0"
              />
              <BsUpload />
              <p className="text-xs text-center">
                Upload License (Accept PDF Only)*
              </p>
            </button>
          </div>
        </div>
        {values.license_image ? (
          <div className="border-r p-4 w-full flex items-center">
            <div className="w-full">
              {pdfLoad ? (
                <MiniLoader />
              ) : (
                <>
                  {(values.license_image || license_image) && (
                    <div className="flex justify-between border w-full p-1 px-2 rounded-md bg-slate-200 shadow-lg">
                      <div className="flex items-center justify-between gap-1 w-full">
                        <p className="text-md flex items-center">
                          {values.license_image
                            ?.split("license")[1]
                            ?.slice(1)
                            ?.substring(0, 18)}
                        </p>
                        <button onClick={handleDownload}>
                          <IoDownloadOutline className="font-semibold text-lg" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {errors.license_image && touched.license_image && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.license_image}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LisenceDocuments;
