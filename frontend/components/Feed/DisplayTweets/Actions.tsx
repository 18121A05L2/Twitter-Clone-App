import React from "react";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { IoShareOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { commentAdded } from "../../../Redux/features/GlobalSlice";
import {
  modalStateChainging,
  tweetContent,
} from "../../../Redux/features/CommentSlice";
import Like from "./Like";
import { postType } from "../../../Types/Feed.types";
const styles = {
  icon: " w-[2.3rem] h-[2.3rem] text-gray-600 cursor-pointer  p-2 ",
};

function Actions({ post }: { post?: postType }) {
  const dispatch = useDispatch();
  return (
    <div>
      <section className="flex justify-between">
        <div className="flex items-center gap-2">
          <FaRegComment
            onClick={(e) => {
              e.stopPropagation();
              dispatch(modalStateChainging());
              dispatch(tweetContent(post));
              dispatch(commentAdded());
            }}
            className={styles.icon}
          />
          <p>{post?.comments?.length}</p>
        </div>
        <AiOutlineRetweet
          className={
            styles.icon +
            " rounded-full hover:bg-green-200 hover:text-green-700  "
          }
        />
        <div className="flex items-center gap-2">
          <Like styles={styles} post={post} />
          <p> {post?.likes?.length} </p>
        </div>
        <IoShareOutline className={styles.icon} />
      </section>
    </div>
  );
}

export default Actions;
