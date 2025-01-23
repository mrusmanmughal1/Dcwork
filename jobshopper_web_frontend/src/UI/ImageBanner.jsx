const ImageBanner = ({ text }) => {
  return (
    <div className=" h-28 overflow-hidden  relative img-banner flex justify-center items-center bg-cover  ">
      <div className="absolute inset-0 bg-btn-primary  opacity-60 "></div>
      <div className="text-4xl absolute    font-bold text-white ">{text}</div>
    </div>
  );
};

export default ImageBanner;
