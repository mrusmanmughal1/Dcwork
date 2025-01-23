import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserinfo } from "../../Context/AuthContext";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { auth, user_type } = useUserinfo();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  if (auth && user_type === "candidate") {
    return children;
  }  
};

export default ProtectedRoutes;
