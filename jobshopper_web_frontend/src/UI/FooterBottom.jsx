import { BiSolidUpArrowSquare } from "react-icons/bi";

const FooterBottom = () => {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div className="flex lg:justify-between justify-center  px-6 md:px-16 bg-[#f5f2f2] text-sm py-4">
      <p className="text-xs md:text-base">
        &#169; 2024. Copyrights by Jobs Shopper & 7 Kings Code{" "}
      </p>
      <div className="hidden lg:block ">
        <button onClick={scrollToTop}>
          <p className="flex   capitalize  hover:cursor-pointer items-center gap-2">
            Back to Top <BiSolidUpArrowSquare className="text-2xl" />{" "}
          </p>
        </button>
      </div>
    </div>
  );
};

export default FooterBottom;
