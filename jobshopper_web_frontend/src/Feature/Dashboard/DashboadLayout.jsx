import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../UI/Sidebar";
import ImageBanner from "../../UI/ImageBanner";

const DashboadLayout = () => {
  const location = useLocation();
  const params = location.pathname;

  let accountMessage;

  switch (params) {
    case "/dashboard/jobs-basket":
      accountMessage = "Job Cart";
      break;
    case "/dashboard/profile":
      accountMessage = "Manage Profile";
      break;

    case "/dashboard/profile/candiate-address-info":
      accountMessage = "Manage Profile";
      break;

    case "/dashboard/profile/candiate-previous-history":
      accountMessage = "Manage Profile";
      break;
    case "/dashboard/profile/candiate-profession-info":
      accountMessage = "Manage Profile";
      break;

    case "/employer-dashboard/profile/employer-Details":
      accountMessage = "Manage Profile";
      break;

    case "/employer-dashboard/profile/Employer-Company-Details":
      accountMessage = "Manage Profile";
      break;

    case "/employer-dashboard/profile/Employer-Profile-complete":
      accountMessage = "Manage Profile";
      break;

    case "/dashboard/candidate-applied-job":
      accountMessage = "Job Applied";
      break;
    case "/dashboard/myaccount":
      accountMessage = "My Account";
      break;
    case "/employer-dashboard/scheduled-interviews":
      accountMessage = "Sheduled Interviews";
      break;
    case "/employer-dashboard/new-post":
      accountMessage = "New Job Post";
      break;
    case "/employer-dashboard/myaccount":
      accountMessage = "My Account";
      break;
    case "/employer-dashboard/applied":
      accountMessage = "Job Posting History ";
      break;
    case "/employer-dashboard/payment-history":
      accountMessage = "Payment History ";
      break;
    case "/employer-dashboard/profile":
      accountMessage = "Manage Profile";
      break;

    default:
      accountMessage = " "; // Default case if none match
  }
  return (
    <div>
      <ImageBanner text={accountMessage} />

      <div className="flex md:gap-24     w-11/12 mx-auto py-10 md:flex-row flex-col gap-8">
        <div className="w-full   md:w-1/4">
          <div className="">{<Sidebar baseurl="" />}</div>
        </div>
        <div className=" mx-auto w-full  md:w-3/4 "> {<Outlet />}</div>
      </div>
    </div>
  );
};

export default DashboadLayout;
