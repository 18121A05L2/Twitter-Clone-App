import React, { useEffect } from "react";
import { FiTwitter } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { clicked } from "../../../Redux/features/GlobalSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosAPI from "../../../axios";
import { postType } from "../../../Types/Feed.types";
import { RootState } from "../../../Redux/app/store";

var twitterTone: HTMLAudioElement;

type propsType = {
  styles: {
    icon: String;
  };
  post?: postType;
};

function Like({ styles, post }: propsType) {
  useEffect(() => {
    twitterTone = new Audio("/twitter-tone.mp3");
  }, []);
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.blockchain);

  const postId = post?._id;
  const userId = "@" + profile.userId?.split(" ")[0].toLowerCase();
  const isLiked = post?.likes?.filter((like) => like.userId === userId);

  async function handleLikes(e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.stopPropagation();
    const data = {
      userId: userId,
      postId: postId,
    };

    await axiosAPI.post("/likes", JSON.stringify(data)).then((value) => {
      console.log(
        "%c" + value.data,
        "color: green; background: yellow; font-size: 15px"
      );
      dispatch(clicked());
    });
  }

  return (
    <div>
      <FiTwitter
        id="like"
        onClick={(e) => {
          twitterTone.play();
          handleLikes(e);
        }}
        className={
          styles.icon +
          `  ${
            isLiked?.length && "  fill-twitter text-blue-400 "
          } transition-scale duration-500 ease-in hover:fill-twitter hover:text-twitter active:scale-[5] `
        }
      />
    </div>
  );
}

export default Like;
