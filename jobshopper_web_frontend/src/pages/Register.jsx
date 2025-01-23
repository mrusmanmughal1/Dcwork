import { useNavigate } from "react-router-dom";
import { useUserinfo } from "../Context/AuthContext";
import ImageBanner from "../UI/ImageBanner";
import RegisterFOrm from "../UI/RegisterFOrm";
import { useEffect } from "react";

const Register = () => {

  const { auth } = useUserinfo();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth, navigate]);
  const url =
    "http://demo.cmssuperheroes.com/themeforest/wp-recruitment/wp-content/themes/wp-recruitment/assets/images/bg-page-title.jpg";
  return (
    <div>
      <ImageBanner url={url} text={"Register"} />
      <div className=" py-4 md:py-10   w-11/12 mx-auto">
        <RegisterFOrm />
      </div>
    </div>
  );
};

export default Register;
