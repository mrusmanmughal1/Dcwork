import { Line } from "react-chartjs-2";

const AdminLineGraph = ({ candidates, pending, allJObs, employer }) => {
  const rev = [
    {
      label: "Jan",
      Employees: 64854,
      Candidates: 32652,
      Jobs: 9090,
    },
    {
      label: "Feb",
      Employees: 54628,
      Candidates: 42393,
      Jobs: 9090,
    },
    {
      label: "Mar",
      Employees: 117238,
      Candidates: 50262,
      Jobs: 9090,
    },
    {
      label: "Apr",
      Employees: 82830,
      Candidates: 64731,
      Jobs: 9090,
    },
    {
      label: "May",
      Employees: 91208,
      Candidates: 41893,
      Jobs: 90910,
    },
    {
      label: "Jun",
      Employees: 103609,
      Candidates: 83809,
      Jobs: 90190,
    },
    {
      label: "Jul",
      Employees: 90974,
      Candidates: 44772,
      Jobs: 9090,
    },
    {
      label: "Aug",
      Employees: 82919,
      Candidates: 37590,
      Jobs: 9090,
    },
    {
      label: "Sep",
      Employees: 62407,
      Candidates: 43349,
      Jobs: 91090,
    },
    {
      label: "Oct",
      Employees: 82528,
      Candidates: 45324,
      Jobs: 19090,
    },
    {
      label: "Nov",
      Employees: 56979,
      Candidates: 47978,
      Jobs: 9090,
    },
    {
      label: "Dec",
      Employees: 87436,
      Candidates: 39175,
      Jobs: 9090,
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
    <div className="  bg-white rounded-md shadow-lg  p-8   flex  ">
      <Line
        options={options}
        data={{
          labels: rev?.map((data) => data.label),
          datasets: [
            {
              label: "Employees",
              data: rev?.map((data) => data.Employees),
              backgroundColor: "#064FF0",
              borderColor: "#064FF0",
            },
            {
              label: "Candidates",
              data: rev?.map((data) => data.Candidates),
              backgroundColor: "#FF3030",
              borderColor: "#FF3030",
            },
            {
              label: "Jobs Posted",
              data: rev?.map((data) => data.Jobs),
              backgroundColor: "#FF3030",
              borderColor: "#FF3030",
            },
          ],
        }}
        
      />
    </div>
  );
};

export default AdminLineGraph;
