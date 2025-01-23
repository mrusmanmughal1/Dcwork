import logo from "../assets/logo.webp";
const Logo = ({ width, isSticky }) => {
  return (
    <div
      className={`${
        isSticky
          ? "pb-0 w-[160px] overflow-hidden"
          : "pb-2 !w-[200px] overflow-hidden  xl:w-auto "
      }`}
    >
      <img
        src={logo}
        alt="logo"
        width="100%"
        height="100%"
        className="  object-contain"
      />
    </div>
  );
};

export default Logo;
