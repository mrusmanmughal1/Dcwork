import { Navigate, useLocation } from "react-router-dom";
import { useUserinfo } from "../../Context/AuthContext";
import IndexChat from "./IndexChat";
import SingleChat from "./SingleChat";
import { EMPLOYER, CANDIDATE } from "../../utils/Constants";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const { auth, user_type } = useUserinfo();

  const location = useLocation();
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Redirect if not authenticated or not an employer or candidate
  if (!auth && !(user_type === EMPLOYER || user_type === CANDIDATE)) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return (
    <div className="  ">
      <div className="flex lg:flex-row flex-col flex-grow">
        <div className=" relative  lg:w-[25%] ">
          <div className="bg-btn-prim ary px-8 py-3  text-btn-primary  font-semibold border-r border-b">
            ALL MESSAGES
          </div>
          <div className="border-r   ">
            <IndexChat setuser={setCurrentUser} currentUser={currentUser} />
          </div>
        </div>
        <div className="lg:w-[75%] ">
          <div className="  px-8 py-3    border-b">
            <div className="flex items-center gap-2">
              <div className="  font-semibold  text-btn-primary  uppercase">
                {" "}
                {currentUser ? currentUser.name : "Start Messaging"}
              </div>
            </div>
          </div>

          <div className="flex   justify-between flex-col h-full  ">
            {currentUser ? (
              <div className="flex justify-between flex-col h-[70vh]    ">
                {" "}
                <SingleChat userData={currentUser} />
                <ChatInput currentUser={currentUser} />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center font-semibold text-2xl mt-20">
                <div className=" flex justify-center flex-col items-center text-btn-primary  ">
                  <HiMiniChatBubbleLeftRight className="text-7xl" />
                  <p className="text-sm pb-8">Let's start a new conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
