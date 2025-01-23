import { useNavigate } from "react-router-dom";
import ImageBanner from "../UI/ImageBanner";
import LoginForm from "../UI/LoginForm";
import { useUserinfo } from "../Context/AuthContext";
import { useEffect } from "react";
import topimg from "../assets/bg-page-top.jpg";

const LoginPage = () => {
  const { auth } = useUserinfo();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div className=" ">
      <ImageBanner url={topimg} text={"LOGIN"} />
      <div className=" py-10    ">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
