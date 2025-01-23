import { createContext, useContext, useReducer, useState } from "react";

const Chat = createContext();

const initialState = {
  Recever_id: "",
  Receiver_user_id: "",
  Sender_username: "",
  Sender_user_id: "",
  user_type: "",
  timeStamp: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "Receiver":
      return {
        ...state,
        Receiver_user_id: action.payload.Receiver_user_id,
        Recever_id: action.payload.Recever_id,
      };
    case "sender":
      return {
        ...state,
        Sender_username: action.payload.Sender_username,
        Sender_user_id: action.payload.Sender_user_id,
      };
    default:
      state;
  }
};

const ChatContext = ({ children }) => {
  const [show, setshow] = useState();
  const [{ Receiver_user_id, Recever_id }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <Chat.Provider
      value={{ Receiver_user_id, dispatch, show, setshow, Recever_id }}
    >
      {children}
    </Chat.Provider>
  );
};
const useChatContext = () => {
  const ChatData = useContext(Chat);

  if (ChatData === undefined) throw new Error("Context Not Working fine .. ");
  return ChatData;
};

export { ChatContext, useChatContext };
