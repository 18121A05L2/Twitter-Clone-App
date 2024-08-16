import React, { useState } from "react";
import { IconType } from "react-icons";
import Link from "next/link";
import { useRouter } from "next/router";

type PropsType = {
  Icon: IconType;
  text: string;
  onClick?: () => {};
};

function SideBarItem({ Icon, text }: PropsType) {
  const router = useRouter();
  const isPageActive = router.asPath?.split("/")[1] === text.toLowerCase();
  console.log(isPageActive, router.asPath);
  return (
    <Link href={`/${text.toLowerCase()}`} passHref>
      <div className="flex ">
        <div className="group flex  cursor-pointer justify-center rounded-full p-3 text-black transition-all  duration-300 hover:bg-slate-100 dark:hover:bg-slate-500 lg:mr-auto  ">
          <Icon
            className={`h-[1.5rem] w-[1.5rem] bg-red color-red  dark:fill-[#F1F1F1] ${isPageActive && "fill-[#4FD8E0] dark:fill-[#4FD8E0]"} `}
          />
          <p
            className={`hidden pl-3 font-semibold   group-hover:text-[#4FD8E0] lg:inline ${isPageActive ? " text-[#4FD8E0] dark:text-[#4FD8E0] " : " text-[#436475] dark:text-[#F1F1F1]"}  `}
          >
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default SideBarItem;
