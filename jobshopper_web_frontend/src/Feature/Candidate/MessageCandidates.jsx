import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useUserinfo } from "../../Context/AuthContext";
import { db } from "../../Services/Firebase/Firebase.Config";
import toast from "react-hot-toast";
import MiniLoader from "../../UI/MiniLoader";
import { useEmployerDetails } from "../../Services/Employer/useEmployerDetails";
import { BASE_URL_IMG } from "../../config/Config";
const MessageCandidates = ({
  RecUserName,
  Recfirst_name,
  Reclast_name,
  RecvID,
  setmodel,
  url,
}) => {
  const { data, isPending } = useEmployerDetails();
  const [message, setmessage] = useState("");
  const { user_id, username } = useUserinfo();
  const [loading, setloading] = useState(false);
  const [empty, setempty] = useState();

  const id = `user_id${username}${user_id}`;
  const senderid = id.replace(/ /g, "_");

  const ReciverID = `user_id${RecUserName}${RecvID}`;
  const Rec = ReciverID.replace(/ /g, "_");

  const handlemessage = () => {
    setmessage("");
  };
  const sendMessage = async () => {
    if (!message.trim()) {
      setempty("Message cannot be empty");
      return;
    }
    setloading(true);
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
        url: BASE_URL_IMG + data.data.data.avatar_image,
        timeStamp,
      };

      const receiverInbox = {
        id: RecvID.toString(),
        name: RecUserName,
        fullName: "fristLAstn",
        lastMsg: message,
        url: url,
        timeStamp,
      };

      const senderInboxRef = doc(db, "Chats", senderid, "Inbox", Rec);

      await setDoc(senderInboxRef, receiverInbox);
      handlemessage();
      const receiverInboxRef = doc(db, "Chats", Rec, "Inbox", senderid);

      await setDoc(receiverInboxRef, senderInbox);

      toast.success("Your Message is Successfully sent !");
      setloading(false);
      setmodel(false);
    } catch (error) {
      // console.error("Error writing document: ", error);
    }
  };
  if (isPending)
    return (
      <div className=" p-20">
        {" "}
        <MiniLoader />
      </div>
    );
  return (
    <div>
      <div className="p-8">
        <div
          className={` ${
            empty ? "border-red-600" : ""
          } text-2xl mb-4 font-semibold text-btn-primary`}
        >
          Send Your Message to {Recfirst_name} {Reclast_name}
        </div>
        <div className=" border">
          <textarea
            cols={70}
            rows={4}
            value={message}
            placeholder="Type  Your Message Here  "
            type="text"
            className="p-4 w-full"
            onChange={(e) => setmessage(e.target.value)}
          />
        </div>
        <div className=" flex justify-between">
          <button
            onClick={sendMessage}
            disabled={loading}
            className="text-white bg-btn-primary p-4 rounded-md my-4"
          >
            {loading ? <MiniLoader /> : "Send Message"}
          </button>
          <button
            className="text-white bg-gray-700 p-4 rounded-md my-4"
            onClick={() => setmodel(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageCandidates;
