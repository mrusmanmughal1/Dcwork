import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useUserinfo } from "../../Context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../Services/Firebase/Firebase.Config";
import { BASE_URL_IMG } from "../../config/Config";

const ChatInput = ({ currentUser }) => {
  const { id: iddd, name, url } = currentUser || {};
  const [message, setmessage] = useState("");

  const { user_id, username, avatar_image } = useUserinfo();
  const [empty, setempty] = useState();
  const id = `user_id${username}${user_id}`;
  const senderid = id.replace(/ /g, "_");

  const ReciverID = `user_id${name}${iddd}`;
  const Rec = ReciverID.replace(/ /g, "_");

  // send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setempty("Message cannot be empty");
      return;
    }
    const timeStamp = Date.now().toString(); // Create chat model
    const chatModel = {
      timeStamp,
      message,
      senderID: senderid,
      receiverID: Rec,
    };
    try {
      const senderRef = doc(db, "Chats", senderid, Rec, timeStamp);

      await setDoc(senderRef, chatModel);

      const receiverRef = doc(db, "Chats", Rec, senderid, timeStamp);

      await setDoc(receiverRef, chatModel);

      const senderInbox = {
        id: user_id.toString(),
        name: username,
        lastMsg: message,
        fullName: "fristLAstn",
        url: BASE_URL_IMG + avatar_image,
        timeStamp,
      };

      const receiverInbox = {
        id: currentUser.id.toString(),
        name: name,
        fullName: "fristLAstn",
        lastMsg: message,
        url: url,
        timeStamp,
      };

      const senderInboxRef = doc(db, "Chats", senderid, "Inbox", Rec);

      await setDoc(senderInboxRef, receiverInbox);

      const receiverInboxRef = doc(db, "Chats", Rec, "Inbox", senderid);

      await setDoc(receiverInboxRef, senderInbox);

      setmessage("");
    } catch (error) {
      // console.error("Error writing document: ", error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Add a new line to the message
        setmessage((prev) => prev + "\n");
      } else {
        // Send the message
        sendMessage(event); // Pass the event to prevent default behavior
      }
      event.preventDefault(); // Prevent default form submission behavior
    }
  };

  return (
    <div className="">
      <form className="flex gap-1 p-2" onSubmit={sendMessage}>
        <textarea
          type="text"
          value={message}
          placeholder="Type your message here.. "
          onKeyDown={handleKeyDown}
          onChange={(e) => setmessage(e.target.value)}
          className={`w-full border-2 rounded-md ps-2 ${
            empty ? "border-red-800" : "border-btn-primary"
          }`}
        />
        <button
          type="submit"
          className=" rounded-md text-xl bg-btn-primary text-white p-2"
        >
          <IoIosSend />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
