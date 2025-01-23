import { useEffect, useState } from "react";
import { IoChatbubbleSharp } from "react-icons/io5";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Services/Firebase/Firebase.Config";
import { useUserinfo } from "../../Context/AuthContext";
import ChatBox from "./ChatBox";
import { useChatContext } from "../../Context/ChatContext";

const ChatMain = () => {
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]); // to store the messages data
  const [users, setUsers] = useState([]); // to store users data
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To store error messages

  const { user_id, username } = useUserinfo();
  const { Receiver_user_id } = useChatContext();
  const id = `user_id${username}${user_id}`;
  const senderid = id.replace(/ /g, "_");

  useEffect(() => {
    const chatCollectionRef = collection(
      db,
      "Chats",
      "user_idMangoDevs13",
      "user_idusmancan7"
    );

    const getDocument = async (senderId, receiverId, timeStamp) => {
      const unsubscribe = onSnapshot(
        chatCollectionRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const chats = snapshot.docs.map((doc) => doc.data());
            setChatList(chats);
          } else {
            setChatList([]);
          }
          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
    };
    getDocument();
  }, []);
  const { show, setshow } = useChatContext();
  return (
    <div>
      {show && <ChatBox />}
      <div
        onClick={() => setshow(!show)}
        className="fixed hover:cursor-pointer bg-btn-primary shadow-sm  shadow-white outline-white p-4 rounded-full z-50 bottom-4 right-10 text-white text-3xl"
      >
        <IoChatbubbleSharp />
      </div>
    </div>
  );
};

export default ChatMain;
