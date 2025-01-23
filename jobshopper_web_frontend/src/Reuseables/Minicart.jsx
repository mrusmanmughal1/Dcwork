import { useEffect, useRef } from "react";

const Minicart = ({ children, style, data, set, profile }) => {
  const top = data ? "top-22" : "md:top-[7.5rem] top-28  ";
  const ref = useRef();
  useEffect(() => {
    function handleClick(e) {
      // Check if clicked outside the ref or on the ref itself
      if (!ref.current || !ref.current.contains(e.target)) {
        set(false); // Set state to false
      }
    }

    document.addEventListener("click", handleClick, true);

    // Cleanup function to remove listener on unmount
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref, profile]);

  return (
    <div
      ref={ref}
      className={`${style}  bg-white absolute z-40 shadow-md rounded-sm  ${top}`}
    >
      {children}
    </div>
  );
};

export default Minicart;
