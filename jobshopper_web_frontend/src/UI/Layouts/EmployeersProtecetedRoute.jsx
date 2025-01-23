import { useEffect, useState } from "react";
import { useUserinfo } from "../../Context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../Loader"; // Optional: A loading spinner component

const EmployersProtectedRoute = ({ children }) => {
  const { auth, user_type } = useUserinfo();
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Local loading state
  useEffect(() => {
    // If both auth and user_type are defined, we can stop the loading state
    if (auth !== undefined && user_type !== undefined) {
      setLoading(false);
    }
  }, [auth, user_type]);

  if (loading) {
    return <Loader />; // Or return null if you don't want a loader
  }

  // Check if the user is authenticated and is an employer
  if (auth && user_type === "employer") {
    return children;
  } else {
    // Redirect to the homepage if not an employer or not authenticated
    return <Navigate to="/" state={{ from: location }} />;
  }
};

export default EmployersProtectedRoute;
