const Loader = ({ style }) => {
  return (
    <div
      className={`${style} w-full flex  justify-center   items-center flex-col gap-5   `}
    >
      <div
        className="w-20 h-20 rounded-full animate-spin
        border-8 border-solid border-purple-500 border-t-transparent"
      ></div>
      <p className="text-2xl font-bold uppercase text-purple-900">
        Loading ....
      </p>
    </div>
  );
};

export default Loader;
