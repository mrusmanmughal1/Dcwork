import { Bar } from "react-chartjs-2";

const AdminBarGraph = ({ candidates, AllJobs, employer }) => {
  const SourceData = [
    {
      label: "Candidates",
      value: candidates?.data?.count,
    },
    {
      label: "Jobs Posted",
      value: AllJobs?.data?.count,
    },
    {
      label: "Employeers",
      value: employer?.data?.count,
    },
  ];
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className=" w-full md:h-80  flex justify-center bg-white rounded-md shadow-lg p-8 ">
      {/* bar chart  */}
      <Bar
        className="aa"
        options={options}
        data={{
          labels: SourceData?.map((data) => data.label),
          datasets: [
            {
              label: "Total Count Graph ",
              data: SourceData?.map((data) => data.value),
              backgroundColor: [
                "rgba(43, 63, 229, 99)",
                "rgba(250, 192, 19, 10)",
                "rgba(253, 135, 135, 1)",
              ],
              borderRadius: 5,
            },
          ],
        }}
      />
    </div>
  );
};

export default AdminBarGraph;
