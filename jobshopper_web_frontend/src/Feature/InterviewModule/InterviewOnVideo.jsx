import { useFormik } from "formik";
import { useScheduleInterview } from "../../Services/Interview/useScheduleInterview";
import { InterviewOnVideos } from "../../helpers/Schema/FormValidation";
import moment from "moment";
import MiniLoader from "../../UI/MiniLoader";

const InterviewOnVideo = ({
  type = "",
  applicantID,
  setinterviewModel,
  settype,
}) => {
  const initialValues = {
    job_application: applicantID,
    interview_type: type,
    interviewer_name: "",
    video_meeting_link: "",
    date_time_start: "",
    date_time_end: "",
    interview_date: "",
  };

  const handleTimeChange = (time, field) => {
    const formattedTime = moment(time, "HH:mm").format("HH:mm");
    handleChange({ target: { name: field, value: formattedTime } });
  };
  const { mutate: interview, isPending, isError } = useScheduleInterview();
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      onSubmit: (values, action) => {
        const data = {
          ...values,
          date_time_end: `${values.interview_date}:${values.date_time_start}`,
          date_time_start: `${values.interview_date}:${values.date_time_end}`,
        };
        interview(data, {
          onSuccess: () => {
            setinterviewModel(false);
            settype("");
          },
        });
      },
      validationSchema: InterviewOnVideos,
    });

  const handleInput = (event) => {
    const input = event.target;

    if (input.name === "interviewer_name") {
      if (
        input.selectionStart === 0 &&
        (event.key === " " || event.keyCode === 32)
      ) {
        event.preventDefault(); // Block the space from being typed at the beginning
      }

      if (
        !/[A-Za-z\s]/.test(event.key) &&
        event.key !== "Backspace" &&
        event.key !== "Delete"
      ) {
        event.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="py-8 space-y-4">
      <div className="">
        <label htmlFor="interviewer_name" className="font-semibold ">
          Interviewer Name
        </label>
        <input
          type="text"
          placeholder="Enter Interviewer Name"
          name="interviewer_name"
          onChange={handleChange}
          onKeyDown={handleInput}
          onBlur={handleBlur}
          maxLength={25}
          value={values.interviewer_name}
          className={`py-3 bg-gray-100 px-6 outline-none w-full ${
            errors.interviewer_name && touched.interviewer_name
              ? "border-red-500 border"
              : " "
          }`}
        />
        {errors.interviewer_name && touched.interviewer_name && (
          <p className="text-start px-1 text-sm font-semibold text-red-600">
            {errors.interviewer_name}
          </p>
        )}
      </div>
      <div className="">
        <label className="font-semibold ">
          Interview Link
          <span className="text-sm px-2 font-normal">
            Enter Interview Link{" "}
            <span className="text-xs"> Eg: (Google Meet / Zoom)</span>
          </span>
        </label>
        <input
          type="text"
          placeholder="Enter Meeting  Link"
          name="video_meeting_link"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.video_meeting_link}
          className={`py-3 bg-gray-100 px-6 outline-none w-full ${
            errors.video_meeting_link && touched.video_meeting_link
              ? "border-red-500 border"
              : " "
          }`}
        />
        {errors.video_meeting_link && touched.video_meeting_link && (
          <p className="text-start px-1 text-sm font-semibold text-red-600">
            {errors.video_meeting_link}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="w-full">
          <p className="font-semibold">Select Interview Date</p>
          <input
            type="date"
            id="appt"
            name="interview_date"
            className={` border w-full bg-slate-100 p-2 ${
              errors.interview_date && touched.interview_date
                ? "border-red-500 border"
                : " "
            }`}
            onChange={handleChange}
          />
          {errors.interview_date && touched.interview_date && (
            <p className="text-start px-1 text-sm font-semibold text-red-600">
              {errors.interview_date}
            </p>
          )}
        </div>
        <div className="flex w-full  gap-10 pb-8">
          <div className="w-full">
            <p className="font-semibold ">Interview Start Time</p>
            <input
              type="time"
              name="date_time_start"
              onChange={(e) =>
                handleTimeChange(e.target.value, "date_time_start")
              }
              onBlur={handleBlur}
              value={values.date_time_start}
              className={` border w-full bg-slate-100 p-2 ${
                errors.date_time_start && touched.date_time_start
                  ? "border-red-500 border"
                  : ""
              }`}
            />
            {errors.date_time_start && touched.date_time_start && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.date_time_start}
              </p>
            )}
          </div>
          <div className="w-full">
            <p className="font-semibold ">Interview End Time</p>
            <input
              type="time"
              name="date_time_end"
              onChange={(e) =>
                handleTimeChange(e.target.value, "date_time_end")
              }
              onBlur={handleBlur}
              value={values.date_time_end}
              className={` border w-full bg-slate-100 p-2 ${
                errors.date_time_end && touched.date_time_end
                  ? "border-red-500 border"
                  : " "
              }`}
            />
            {errors.date_time_end && touched.date_time_end && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.date_time_end}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="text-white bg-btn-primary px-12 uppercase py-4 rounded-md "
        >
          {isPending ? <MiniLoader /> : "Confirm"}
        </button>
      </div>
    </form>
  );
};

export default InterviewOnVideo;
