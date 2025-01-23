import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "./UI/Header";
import Footer from "./UI/Footer";
import ProtectedRoutes from "./Feature/Authentication/ProtectedRoutes";
import AdminProtected from "./Feature/Authentication/AdminProtected";
import ScrollToTop from "./Reuseables/ScrollToTop";
import "./styles/styles.css";
import Loader from "./UI/Loader";
import PaymentHistory from "./Feature/Employer/PaymentHistory";
// Lazy load your components
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Register = lazy(() => import("./pages/Register"));
const MyAccount = lazy(() => import("./Feature/Accounts/MyAccount"));
const JobsBasket = lazy(() => import("./Feature/Candidate/JobsBasket"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ApplicationHistory = lazy(() =>
  import("./Feature/Employer/ApplicationHistory")
);
const Manageprofile = lazy(() => import("./Feature/Accounts/Manageprofile"));
const Candidate = lazy(() => import("./Feature/Candidate/Candidate"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NewPost = lazy(() => import("./Feature/Employer/NewJobPost"));
const CandidateDetails = lazy(() =>
  import("./Feature/Candidate/CandidateDetails")
);
const PrivacyLopicy = lazy(() => import("./pages/PrivacyLopicy"));
const AdminPrivate = lazy(() => import("./Feature/Admin/AdminPrivate"));
const Admin = lazy(() => import("./Feature/Admin/Admin"));
const AdminCandidateList = lazy(() =>
  import("./Feature/Admin/AdminCandidateList")
);
const AdminJobsLIst = lazy(() => import("./Feature/Admin/AdminJobsLIst"));
const AdminEmployeerList = lazy(() =>
  import("./Feature/Admin/AdminEmployeerList")
);
const JobsBySector = lazy(() => import("./UI/JobsBySector"));
const AdminSettings = lazy(() => import("./Feature/Admin/AdminSettings"));
const AdminViewJobs = lazy(() => import("./UI/AdminViewJobs"));
const EmployerViewProfile = lazy(() => import("./UI/EmployerViewProfile"));
const ForGetPassword = lazy(() => import("./UI/ForGetPassword"));
const CandidateViewProfile = lazy(() => import("./UI/CandidateViewprofile"));
const JobDetails = lazy(() => import("./UI/JobDetails"));
const PendingJobs = lazy(() => import("./Feature/Admin/PendingJobs"));
const CandidateAppliedJob = lazy(() =>
  import("./Feature/Candidate/CandidateAppliedJob")
);
const AdminRejectedList = lazy(() =>
  import("./Feature/Admin/AdminRejectedList")
);
const EmpInterviewList = lazy(() =>
  import("./Feature/Employer/EmpInterviewList")
);
const UpdateJob = lazy(() => import("./Feature/Employer/UpdateJob"));
const EmployeersProtecetedRoute = lazy(() =>
  import("./UI/Layouts/EmployeersProtecetedRoute")
);
const ManageCandidateProfile = lazy(() =>
  import("./Feature/Candidate/ManageCandidateProfile")
);
const MyProfileEmployers = lazy(() =>
  import("./Feature/Employer/MyProfileEmployers")
);
const DashboadLayout = lazy(() => import("./Feature/Dashboard/DashboadLayout"));
const Chat = lazy(() => import("./Feature/Chat/Chat"));
const AdminDeactiveUsers = lazy(() =>
  import("./Feature/Admin/AdminDeactiveUsers")
);
const EmployerPersonalDetails = lazy(() =>
  import("./Feature/Employer/EmployerPersonalDetails")
);
const EmployerCompanyDetails = lazy(() =>
  import("./Feature/Employer/EmployerCompanyDetails")
);
const EmployerDetails = lazy(() =>
  import("./Feature/Employer/EmployerDetails")
);
const EmployerCompleteProfile = lazy(() =>
  import("./Feature/Employer/EmployerCompleteProfile")
);
const CandidatePersonalDetails = lazy(() =>
  import("./Feature/Candidate/CandidatePersonalDetails")
);
const CandidateAddress = lazy(() =>
  import("./Feature/Candidate/CandidateAddress")
);
const CandidateEduJobHistory = lazy(() =>
  import("./Feature/Candidate/CandidateEduJobHistory")
);
const CandiateCompleteProfile = lazy(() =>
  import("./Feature/Candidate/CandiateCompleteProfile")
);
const ProfessionDetails = lazy(() =>
  import("./Feature/Candidate/ProfessionDetails")
);
const CandidatesInterviews = lazy(() =>
  import("./Feature/Candidate/CandidatesInterviews")
);

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <ScrollToTop />
      <Suspense
      // fallback={
      //   <div className="py-32">
      //     <Loader />
      //   </div>
      // }
      >
        <Routes>
          <Route
            path="admin"
            element={
              <AdminProtected>
                <AdminPrivate />
              </AdminProtected>
            }
          >
            <Route path="dashboard" index element={<Admin />} />
            <Route path="candidates" element={<AdminCandidateList />} />
            <Route path="/admin/Jobs" element={<AdminJobsLIst />} />
            <Route path="/admin/rejected" element={<AdminRejectedList />} />
            <Route path="/admin/employeers" element={<AdminEmployeerList />} />
            <Route
              path="/admin/deactive-users"
              element={<AdminDeactiveUsers />}
            />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/view-job/:id" element={<AdminViewJobs />} />
            <Route path="/admin/pending-jobs" element={<PendingJobs />} />
            <Route
              path="/admin/employeers/view-employeer-profile/:id"
              element={<EmployerViewProfile />}
            />
            <Route
              path="/admin/candidates/view-candidate-profile/:id"
              element={<CandidateViewProfile />}
            />
          </Route>
          <Route
            path="dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          >
            <Route index element={<MyAccount />} />
            <Route path="jobs-basket" element={<JobsBasket />} />
            <Route path="myaccount" element={<MyAccount />} />
            <Route
              path="interviews-candidate"
              element={<CandidatesInterviews />}
            />
            <Route path="profile" element={<ManageCandidateProfile />}>
              <Route index element={<CandidatePersonalDetails />} />
              <Route
                path="candiate-personal-info"
                element={<CandidatePersonalDetails />}
              />
              <Route
                path="candiate-address-info"
                element={<CandidateAddress />}
              />
              <Route
                path="candiate-profession-info"
                element={<ProfessionDetails />}
              />
              <Route
                path="candiate-previous-history"
                element={<CandidateEduJobHistory />}
              />
              <Route
                path="candidate-profile-Complete"
                element={<CandiateCompleteProfile />}
              />
            </Route>
            <Route
              path="candidate-applied-job"
              element={<CandidateAppliedJob />}
            />
          </Route>
          <Route
            path="employer-dashboard"
            element={
              <EmployeersProtecetedRoute>
                <DashboadLayout />
              </EmployeersProtecetedRoute>
            }
          >
            <Route index element={<MyProfileEmployers />} />
            <Route path="myaccount" element={<MyProfileEmployers />} />
            <Route path="applied" element={<ApplicationHistory />} />
            <Route path="profile" element={<Manageprofile />}>
              <Route
                path="employer-personal"
                element={<EmployerPersonalDetails />}
              />
              <Route
                path="Employer-Company-Details"
                element={<EmployerCompanyDetails />}
              />
              <Route path="employer-Details" element={<EmployerDetails />} />
              <Route
                path="Employer-Profile-complete"
                element={<EmployerCompleteProfile />}
              />
              <Route index element={<EmployerPersonalDetails />} />
            </Route>
            <Route path="new-post" element={<NewPost />} />
            <Route path="scheduled-interviews" element={<EmpInterviewList />} />
            <Route path="payment-history" element={<PaymentHistory />} />

            <Route path="update-job/:id" element={<UpdateJob />} />
          </Route>
          <Route
            path="candidates"
            element={
              <EmployeersProtecetedRoute>
                <Outlet />
              </EmployeersProtecetedRoute>
            }
          >
            <Route index element={<Candidate />} />
            <Route
              path="Candidate-Details/:id"
              element={<CandidateDetails />}
            />
          </Route>
          <Route path="/messages" element={<Chat />} />
          <Route path="/" index element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/forget-password" element={<ForGetPassword />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/register" index element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/job-Details/:id" element={<JobDetails />} />
          <Route path="/privacy-policy" element={<PrivacyLopicy />} />
          <Route path="/jobs-by-sector" element={<JobsBySector />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {location.pathname === "/messages" ? "" : <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
