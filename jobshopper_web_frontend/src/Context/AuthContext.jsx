import { createContext, useContext, useEffect, useReducer } from "react";

const User = createContext();

const initialState = {
  auth: localStorage.getItem("Token") || "",
  username: "",
  user_id: "",
  user_type: "",
  avatar_image: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        auth: true,
        avatar_image: action.payload.avatar_image,
        user_type: action.payload.user_type,
        user_id: action.payload.user_id,
        username: action.payload.username,
      };
    case "logout":
      return { ...initialState, auth: false }; // Reset state on logout
    default:
      state;
  }
};

const AuthContext = ({ children }) => {
  const [{ auth, user_type, user_id, username, avatar_image }, dispatch] =
    useReducer(reducer, initialState);
  useEffect(() => {
    const storedUserData = localStorage.getItem("User_Data");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        const { user_type, user_id, username, avatar_image } = parsedData;
        dispatch({
          type: "login",
          payload: { user_type, user_id, username, avatar_image: avatar_image },
        });
      } catch (error) {
        // console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  return (
    <User.Provider
      value={{ dispatch, auth, user_type, user_id, username, avatar_image }}
    >
      {children}
    </User.Provider>
  );
};
const useUserinfo = () => {
  const Userdata = useContext(User);

  if (Userdata === undefined) throw new Error("Context Not Working fine .. ");
  return Userdata;
};

export { AuthContext, useUserinfo };
