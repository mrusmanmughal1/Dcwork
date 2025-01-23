import { useEffect, useRef } from "react";

const Model = ({ children, model, index }) => {
  const modalRef = useRef();

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (model) {
      modalRef.current.focus(); // Focus on modal for accessibility
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // Restore scroll
    }

    // Cleanup function to reset body scroll when modal closes
    return () => {
      document.body.style.overflow = ""; // Restore scroll
    };
  }, [model]);

  return (
    <div
      className={`fixed ${index} relative top-0 w-full z-40 left-0 ${
        model ? "block" : "hidden"
      }`}
      id="modal"
      ref={modalRef}
    >
      <div className="flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="fixed inset-0 bg-gray-950 opacity-85" />
          <div
            className="inline-block mt-10 bg-white rounded-lg text-left overflow-y-auto shadow-xl transform transition-all lg:w-1/2  w-full max-h-screen"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
