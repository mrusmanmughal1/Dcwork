import { useUserinfo } from "../Context/AuthContext";
import AdminNavbar from "./AdminNavbar";
import GeneralHeaders from "./GeneralHeaders";

const Header = () => {
  const { user_type } = useUserinfo();
  return (
    <div className="relative">
      {user_type == "administrator" ? <AdminNavbar /> : <GeneralHeaders />}
    </div>
  );
};

export default Header;
