import { useState } from "react";
import { useJobStatus } from "../Services/General/useJobStatus";
import { useSearchAPI } from "../Services/General/useSearchAPI";

import ErrorMsg from "../UI/ErrorMsg";
import ImageBanner from "../UI/ImageBanner";
import JobsLayout from "../UI/Layouts/JobsLayout";
import Loader from "../UI/Loader";

const Jobs = () => {
  const { data: JobStatus, isLoading: LoadJobStatus, isError } = useJobStatus();
  const {
    data: searchData,
    isLoading: loadSearch,
    isError: searchError,
  } = useSearchAPI("");
  if (LoadJobStatus || loadSearch) return <Loader style=" py-64" />;
  if (searchData?.data?.results?.count == 0 || searchError) {
    return (
      <div className="w-full">
        <ErrorMsg
          ErrorMsg={"  No Job is  Available  Right Now !  Try Later ."}
        />
      </div>
    );
  }
  return (
    <div className="bg-slate-50">
      <ImageBanner text={"JOBS"} />

      {searchData && <JobsLayout JobStatus={JobStatus} statusError={isError} />}
    </div>
  );
};

export default Jobs;
