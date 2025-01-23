import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js/auto";

import AdminBarGraph from "../../UI/AdminBarGraph";
import AdminDoughnut from "../../UI/AdminDoughnut";
import AdminLineGraph from "../../UI/AdminLineGraph";
import AdminTopWidgets from "../../UI/AdminTopWidgets";
import { useAllCandidates } from "../../Services/Candidate/useCandidateList";
import { useAllEmployer } from "../../Services/admin/useAllEmployer";
import Loader from "../../UI/Loader";
import { useAdminJobsLIsts } from "../../Services/admin/useAdminJobsLists";
import { useAlljobslist } from "../../Services/admin/useAlljobslist";

ChartJS.register(ArcElement, Tooltip, Legend);

const Admin = () => {
  const { data: candidates, isLoading: candidatesLoading } = useAllCandidates();
  const {
    data: pending,
    isLoading: isPending,
    isError,
  } = useAdminJobsLIsts({ status: "pending", page: 1 });

  const {
    data: AllJobs,
    isLoading: isAllJobs,
    isError: jobError,
  } = useAlljobslist();

  const { data: emp, isLoading: loadingEmployers } = useAllEmployer();
  if (candidatesLoading && isPending && isAllJobs && loadingEmployers)
    return <Loader style="h-screen py-20" />;
  return (
    <div>
      <div className="">
        <p className=" pb-4 font-semibold uppercase text-2xl text-center  md:text-start">
          Dashboard
        </p>
      </div>
      {/* Widgets added  */}
      <AdminTopWidgets
        candidates={candidates}
        AllJobs={AllJobs}
        employer={emp}
        pending={pending}
      />

      {/* Chart js   */}
      <div className=" flex flex-col    md:flex-row md:gap-2 gap-8    lg:gap-14 py-14  ">
        <AdminBarGraph
          candidates={candidates}
          AllJobs={AllJobs}
          employer={emp}
        />
        {/* / Doughnut */}
        <AdminDoughnut
          candidates={candidates}
          AllJobs={AllJobs}
          employer={emp}
        />
      </div>
      <div className="">
        <AdminLineGraph
          candidates={candidates}
          AllJobs={AllJobs}
          employer={emp}
        />
      </div>
    </div>
  );
};

export default Admin;
