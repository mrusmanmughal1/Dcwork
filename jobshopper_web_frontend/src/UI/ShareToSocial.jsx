import React from "react";
import { FaFacebookSquare, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const ShareToSocial = () => {
  const currenturl = window.location.href;

  const shareOnFacebook = () => {
    const url = encodeURIComponent(currenturl); // The URL you want to share
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

    window.open(fbShareUrl, "_blank", "width=600,height=400");
  };
  const shareOnTwitter = () => {
    const url = encodeURIComponent(currenturl); // The URL you want to share
    const text = encodeURIComponent("Check out this awesome post!"); // Optional text for the tweet
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;

    window.open(twitterShareUrl, "_blank", "width=600,height=400");
  };
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(currenturl); // The URL you want to share
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    window.open(linkedinShareUrl, "_blank", "width=600,height=400");
  };
  return (
    <div className="flex flex-col md:items-end text-white w-full h-full lg:items-end uppercase mt-4 lg:mt-0">
      <div className="">
        <p className="md:text-center">Share this Job</p>
        <div className="flex mt-2 gap-4">
          <FaFacebookSquare
            className="mr-2 text-4xl hover:cursor-pointer"
            onClick={shareOnFacebook}
          />
          <BsTwitterX
            onClick={shareOnTwitter}
            className="mr-2 hover:cursor-pointer  text-4xl"
          />
          <FaLinkedinIn
            className="mr-2 text-4xl hover:cursor-pointer"
            onClick={shareOnLinkedIn}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareToSocial;
