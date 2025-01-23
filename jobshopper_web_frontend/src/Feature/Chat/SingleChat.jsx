import React, { useEffect, useRef, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../Services/Firebase/Firebase.Config";
import { useUserinfo } from "../../Context/AuthContext";
import MiniLoader from "../../UI/MiniLoader";
const SingleChat = ({ userData = {} }) => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name, id, url } = userData || {};
  const { user_id, username } = useUserinfo();
  const sid = `user_id${username}${user_id}`;
  const senderid = sid.replace(/ /g, "_");
  const endOfMessagesRef = useRef(null);
  const last = useRef(null);

  useEffect(() => {
    if (!userData) return;
    const fetchMessages = async () => {
      try {
        const user_id = `user_id${name}${id}`;
        const receiverId = user_id.replace(/ /g, "_");
        // Create a query to get all chat documents for the current user
        const chatsRef = collection(db, "Chats", senderid, receiverId);
        const q = query(chatsRef);

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const chatList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setdata(chatList);
          setLoading(false);
        });
        setTimeout(() => {
          if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 200);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userData, senderid, name, id]);
  useEffect(() => {
    if (last.current) {
      last.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);
  if (loading)
    return (
      <div className="flex justify-center flex-col items-center pt-16 h-full">
        <MiniLoader />
        <p className="text-btn-primary">Loading Messages ...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center flex-col items-center text-btn-primary">
        {" "}
        Unable To Fetch Data Try Again Later !
      </div>
    );

  return (
    <div className="chat overflow-y-scroll  p-6">
      {data?.map((val, i) => {
        const timestampNumber = parseInt(val.timeStamp, 10);
        const date = new Date(timestampNumber);
        const options = {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        };

        const localTimeString = date.toLocaleString("en-US", options);
        return (
          <div
            key={i}
            className={`${
              senderid == val.senderID
                ? "justify-end items-end text-white "
                : ""
            } space-y-3 p-1 w-full flex flex-col `}
          >
            <div
              className={` break-words whitespace-normal flex bg-purple-300 justify-end   ${
                senderid == val.senderID ? " items-end text-black" : " "
              }       p-2`}
            >
              <span className="whitespace-pre-line max-w-60 md:max-w-96 text-end bg-purple-300 ">
                {val.message}
              </span>
              <div ref={endOfMessagesRef} />
              <div ref={last} />
            </div>
            <p className="text-black text-xs">{localTimeString}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SingleChat;
