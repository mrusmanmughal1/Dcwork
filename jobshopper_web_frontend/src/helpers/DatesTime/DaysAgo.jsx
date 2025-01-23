import moment from "moment";

const DaysAgo = ({ date }) => {
  // Convert the date prop to a moment object
  const eventDate = moment(date);
  const now = moment();

  if (eventDate.isSame(now, "day")) {
    return <div>Today</div>;
  } else {
    const diffInDays = now.diff(eventDate, "days");

    // Only show "1 day ago" if diffInDays is 1, otherwise show the actual number of days
    if (diffInDays === 0) {
      return <div>Today</div>; // or you can return an empty div <div></div>
    }

    return (
      <div>
        {diffInDays} day{diffInDays !== 1 ? "s" : ""} ago
      </div>
    );
  }
};

export default DaysAgo;
