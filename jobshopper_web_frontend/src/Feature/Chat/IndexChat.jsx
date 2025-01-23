import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Services/Firebase/Firebase.Config";
import { useUserinfo } from "../../Context/AuthContext";
import { ImBlocked } from "react-icons/im";
import MiniLoader from "../../UI/MiniLoader";
const IndexChat = ({ setuser, currentUser }) => {
  const [inboxes, setInboxes] = useState([]); // To store all chat documents
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To store error messages

  const { user_id, username } = useUserinfo();
  const id = `user_id${username}${user_id}`;
  const senderid = id.replace(/ /g, "_");
  useEffect(() => {
    const fetchInboxes = async () => {
      try {
        // Create a query to get all chat documents for the current user
        const chatsRef = collection(db, "Chats", senderid, "Inbox");
        const q = query(chatsRef);

        // Fetch all documents matching the query
        const querySnapshot = await getDocs(q);
        const chatList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInboxes(chatList); // Update state with fetched data
      } catch (error) {
        setError(error); // Update error state
      } finally {
        setLoading(false); // Set loading to false once fetching is complete
      }
    };

    fetchInboxes();
  }, [user_id, username]); // Add dependencies if necessary

  return (
    <div className="overflow-y-scroll max-h-[65vh] 2xl ">
      {inboxes?.length == 0 ? (
        <div className="h-96  pt-32 ">
          {loading ? (
            <MiniLoader />
          ) : (
            <div className="flex flex-col justify-center items-center gap-2 text-btn-primary">
              <ImBlocked className="text-2xl text-red-600" />
              <p> You have no messages at this time</p>
            </div>
          )}
        </div>
      ) : (
        inboxes?.map((val, i) => {
          const { id, lastMsg, name, timeStamp, url } = val;
          const timestampNumber = parseInt(timeStamp, 10);
          const date = new Date(timestampNumber);

          // Check if the message is from today
          const isToday = date.toDateString() === new Date().toDateString();

          const formattedDate = isToday
            ? "Today"
            : date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

          return (
            <div
              onClick={() => setuser({ id, name, url })}
              key={id}
              className={`px-2 py-4 border-b hover:bg-slate-300 hover:cursor-pointer ${
                currentUser?.id == id && "bg-purple-200"
              }`}
            >
              <div className="flex items-center uppercase gap-4  w-full">
                <div className=" rounded-full  overflow-hidden ">
                  <img src={url} alt="" className="size-12 object-cover" />
                </div>
                <div className="flex justify-between w-full items-center">
                  <div className="">
                    <p className="font-bold ">{name}</p>
                    <div className="  text-xs">
                      {" "}
                      <p> {lastMsg.slice(0, 20)} </p>
                    </div>
                  </div>

                  <p className="text-[8px]">{formattedDate}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default IndexChat;
