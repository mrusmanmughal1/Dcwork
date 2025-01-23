import { BiWorld } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";
import { useGetSimilarJobs } from "../Services/Jobs/useGetSimilarJobs";
import { NavLink, useParams } from "react-router-dom";
import Loader from "./Loader";
import ErrorMsg from "./ErrorMsg";
import { useUserinfo } from "../Context/AuthContext";
import { CANDIDATE } from "../utils/Constants";
import DOMPurify from "dompurify";

const SimilarJobs = () => {
  const { user_type } = useUserinfo();
  const { id } = useParams();
  const {
    data: similarJobs,
    isLoading: LoadSimilar,
    isError,
  } = useGetSimilarJobs(id);
  if (LoadSimilar)
    return (
      <div className="py-10">
        <Loader />
      </div>
    );
  if (isError)
    return (
      <div className="border">
        <ErrorMsg ErrorMsg="No Recommendations" />
      </div>
    );
  return (
    <div className="shadow py-8  bg-white rounded-md mt-6">
      <div className="text-2xl font-semibold pb-5 px-4">Similar Jobs</div>
      <div className=" border-b border-t">
        {similarJobs?.data?.count == 0 ? (
          <ErrorMsg ErrorMsg="No Similar Job Available" />
        ) : (
          similarJobs?.data?.results?.results.map((val, i) => {
            const sanitizedHtml = DOMPurify.sanitize(val.job_description);

            return (
              <NavLink to={`/job-Details/${val?.id}`} key={val + i}>
                <div
                  className="flex flex-col hover:cursor-pointer gap-2 p-4 border-b hover:bg-purple-50 hover:border-t-2 hover:border-btn-primary hover:duration-700 hover:border-b-slate-300"
                  key={i}
                >
                  <div className="uppercase font-semibold text-black flex justify-between items-center">
                    <p> {val?.title}</p>{" "}
                    <div className="flex">
                      {user_type == CANDIDATE && (
                        <NavLink className="text-white w-[90px] bg-btn-primary p-1 px-2 rounded text-xs">
                          {" "}
                          Apply now{" "}
                        </NavLink>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className=" text-sm flex  items-center gap-1 text-black">
                      <BiWorld />
                      {val?.remote ? (
                        <p>Remote </p>
                      ) : (
                        val?.addresses?.map((val, i) => (
                          <span key={val + i}>{val?.city}</span>
                        ))
                      )}
                    </div>
                    <div className=" text-btn-primary flex gap-1 items-center text-sm">
                      <CiClock2 />
                      {val?.contract_type?.replace("_", " ")}
                    </div>
                  </div>
                  <div className="clamp-lines">
                    <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                  </div>
                </div>
              </NavLink>
            );
          })
        )}
      </div>
      <div className="text-center pt-6">
        <NavLink
          to="/jobs"
          className="bg-btn-primary text-white font-semibold px-4  py-2 rounded-md"
        >
          VIEW MORE
        </NavLink>
      </div>
    </div>
  );
};

export default SimilarJobs;
