import { useState } from "react";
import InterViewOnCall from "./InterViewOnCall";
import InterviewInPerson from "./InterviewInPerson";
import InterviewOnVideo from "./InterviewOnVideo";
import InterviewSelectMode from "./InterviewSelectMode";
import { ImCross } from "react-icons/im";
import "rc-time-picker/assets/index.css";

const InterviewMain = ({ setinterviewModel, interviewModel, applicantID }) => {
  const [type, settype] = useState(null);
  const updateState = () => {
    settype(null);
  };

  return (
    <div className="p-10 px-14 min-h-[30rem] flex flex-col justify-between   relative ">
      <button
        className="absolute right-10 hover:text-btn-primary"
        onClick={() => setinterviewModel(!interviewModel)}
      >
        <ImCross />
      </button>
      <div className="">
        <InterviewSelectMode type={type} settype={settype} />

        {type == "audio_call" && (
          <InterViewOnCall
            applicantID={applicantID}
            type={type}
            key={type}
            updateState={updateState}
            setinterviewModel={setinterviewModel}
          />
        )}
        {type == "video_call" && (
          <InterviewOnVideo
            applicantID={applicantID}
            type={type}
            key={type}
            settype={settype}
            setinterviewModel={setinterviewModel}
          />
        )}
        {type == "in_person" && (
          <InterviewInPerson
            applicantID={applicantID}
            type={type}
            key={type}
            settype={settype}
            setinterviewModel={setinterviewModel}
          />
        )}
      </div>
    </div>
  );
};

export default InterviewMain;
