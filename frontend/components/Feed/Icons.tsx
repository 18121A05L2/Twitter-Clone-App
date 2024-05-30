import React from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { AiOutlineFileGif } from "react-icons/ai";
import { BiPoll } from "react-icons/bi";
import { RiEmotionHappyLine } from "react-icons/ri";
import { VscCalendar } from "react-icons/vsc";
import { FiMapPin } from "react-icons/fi";

const styles = {
  icon: "w-[1.4rem] h-[1.4rem] text-twitter cursor-pointer hover:scale-150 transition-all",
};

function Icons() {
  return (
    <div className="flex items-center gap-3 text-twitter ">
      <HiOutlinePhotograph
        className={styles.icon}
        onClick={() => {
          console.log("clicked photo icon");
        }}
      ></HiOutlinePhotograph>
      <AiOutlineFileGif className={styles.icon} />
      <BiPoll className={styles.icon} />
      <RiEmotionHappyLine className={styles.icon} />
      <VscCalendar className={styles.icon} />
      <FiMapPin className={styles.icon} />
    </div>
  );
}

export default Icons;
