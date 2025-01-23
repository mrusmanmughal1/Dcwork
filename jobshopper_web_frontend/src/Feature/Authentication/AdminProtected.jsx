import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserinfo } from "../../Context/AuthContext";

const AdminProtected = ({ children }) => {
  const navigate = useNavigate();
  const { auth } = useUserinfo();
  const userdata = localStorage.getItem("User_Data");

  const logalJSON = JSON.parse(userdata) || null;
  const { user_type } = logalJSON || {};

  useEffect(() => {
    // Check if the user is authenticated and is an administrator
    if (user_type !== "administrator") {
      navigate("/");
    }
  }, [auth, user_type, navigate]);

  // If the user is authorized, render the children
  return auth && user_type === "administrator" ? children : null;
};

export default AdminProtected;
