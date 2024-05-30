import React from "react";
import { BsLink45Deg } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { MdOutlineBookmarkAdd } from "react-icons/md";

function ShareIcon() {
  return (
    <div className="">
      <div>
        <BsLink45Deg />
        <p>Copy link to Tweet</p>
      </div>

      <div>
        <FiMail />
        <p>Send via Direct Message</p>
      </div>

      <div>
        <MdOutlineBookmarkAdd />
        <p>Bookmark</p>
      </div>
    </div>
  );
}

export default ShareIcon;
