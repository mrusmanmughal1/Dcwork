import { FaCalendarCheck } from "react-icons/fa";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaUserGraduate } from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";
import { useState } from "react";
const AdminTopWidgets = ({ candidates, pending, AllJobs, employer }) => {
  const Raw = [
    {
      title: "Total Jobs Posted",
      number: AllJobs?.data?.count,
      icons: <BsBriefcaseFill />,
    },
    {
      title: "Total  Employeers",
      number: employer?.data?.count,
      icons: <BsPersonWorkspace />,
    },
    {
      title: "Total  Candidates",
      number: candidates?.data?.count,
      icons: <FaUserGraduate />,
    },
    {
      title: "Pending Approvals",
      number: pending?.data?.count,
      icons: <FaCalendarCheck />,
    },
  ];

  const [hover, sethover] = useState();
  return (
    <div className="">
      <div className="flex  justify-between flex-col md:flex-row gap-8       ">
        {Raw?.map((val, i) => {
          const { title, number, icons } = val;
          return (
            <div
              onMouseOver={() => sethover(i)}
              onMouseOut={() => sethover(null)}
              className={`${
                hover == i && "text-white "
              } bg-white   rounded-md p-8 transition-all duration-500 hover:border-purple-900  border-2 hover:bg-purple-900  hover:text-white flex-col flex gap-3 font-semibold   shadow-lg  `}
              key={i}
            >
              <div className="">
                <p
                  className={`font-bold uppercase   text-center text-lg ${
                    hover == i && "text-white"
                  }`}
                >
                  {title}
                </p>
                <p
                  className={`text-btn-primary  text-2xl   2xl:text-4xl font-bold flex  justify-center gap-4 ${
                    hover == i && "text-white"
                  }`}
                >
                  {number} {icons}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminTopWidgets;
