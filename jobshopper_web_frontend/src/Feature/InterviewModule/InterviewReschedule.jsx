import { useFormik } from "formik";
import {
  IntervireOnCall,
  upateINterview,
} from "../../helpers/Schema/FormValidation";
import moment from "moment";
import MiniLoader from "../../UI/MiniLoader";
import { RxCross2 } from "react-icons/rx";
import { useEffect } from "react";
import { useUpdateInterview } from "../../Services/Interview/useUpdateInterview";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const InterviewReschedule = ({ interview, setmodel }) => {
  const queryClient = useQueryClient();

  const { id, date_time_start, date_time_end } = interview || {};

  const formattedDate = moment(date_time_start).format("YYYY-MM-DD");
  const startTime = moment(date_time_start).format("HH:mm:ss");
  const endTime = moment(date_time_end).format("HH:mm:ss");

  const initialValues = {
    date_time_start: startTime || "",
    date_time_end: endTime || "",
    interview_date: formattedDate || "", // Set the initial date value
  };
  const handleTimeChange = (time, field) => {
    const formattedTime = moment(time, "HH:mm").format("HH:mm");
    handleChange({ target: { name: field, value: formattedTime } });
  };

  const { mutate: Reinterview, isPending } = useUpdateInterview();
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: (values) => {
      const data = {
        ...values,
        date_time_end: `${values.interview_date}:${values.date_time_start}`,
        date_time_start: `${values.interview_date}:${values.date_time_end}`,
      };

      Reinterview(data, {
        onSuccess: () => {
          toast.success("Interview rescheduled successfully");
          queryClient.invalidateQueries(["Interviews"]);
          setmodel(false);
        },
      });
    },
    validationSchema: upateINterview,
    enableReinitialize: true,
    validateOnBlur: true, // Enable validation on blur instead of on mount
    validateOnChange: false, // Disable validation during onChange
  });

  useEffect(() => {
    if (id) {
      setFieldValue("id", id);
      setFieldValue("interview_date", formattedDate); // This should be set here.
      setFieldValue("date_time_start", startTime);
      setFieldValue("date_time_end", endTime);
    }
  }, [formattedDate, startTime, endTime, setFieldValue, id, interview]); // Re-render the form with the updated date and time values

  return (
    <div className="p-10 relative">
      <p className="capitalize font-semibold text-xl mb-6">
        Reschedule Interview
      </p>
      <button
        onClick={() => setmodel(false)}
        className="absolute right-10 top-10"
      >
        <RxCross2 />
      </button>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="w-full">
            <p className="font-semibold">Select Interview Date</p>
            <input
              type="date"
              id="appt"
              name="interview_date"
              className="border w-full bg-slate-100 p-2"
              onChange={handleChange}
              value={values.interview_date}
            />
            {errors.interview_date && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.interview_date}
              </p>
            )}
          </div>
          <div className="flex w-full gap-10 pb-8">
            <div className="w-full">
              <p className="font-semibold">Interview Start Time</p>
              <input
                type="time"
                name="date_time_start"
                onChange={(e) =>
                  handleTimeChange(e.target.value, "date_time_start")
                }
                onBlur={handleBlur}
                value={values.date_time_start}
                className="w-full border bg-slate-100 p-2"
              />
              {errors.date_time_start && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.date_time_start}
                </p>
              )}
            </div>
            <div className="w-full">
              <p className="font-semibold">Interview End Time</p>
              <input
                type="time"
                name="date_time_end"
                onChange={(e) =>
                  handleTimeChange(e.target.value, "date_time_end")
                }
                onBlur={handleBlur}
                value={values.date_time_end}
                className="w-full border bg-slate-100 p-2"
              />
              {errors.date_time_end && (
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
            className="bg-btn-primary text-white px-12 uppercase py-4 rounded-md"
          >
            {isPending ? <MiniLoader /> : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewReschedule;
