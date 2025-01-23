const MiniLoader = ({ color }) => {
  return (
    <div className="flex  items-center flex-col gap-5   ">
      <div
        className={`w-4 h-4 rounded-full animate-spin
        border-4  border-solid  ${
          color ? color : "border-purple-500"
        } border-t-transparent`}
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};

export default MiniLoader;
