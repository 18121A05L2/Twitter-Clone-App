import React, { useState } from "react";
import { IconType } from "react-icons";
import Link from "next/link";

type PropsType = {
  Icon: IconType;
  text: string;
  onClick?: () => {};
};

function SideBarItem({ Icon, text }: PropsType) {
  return (
    <Link href={`/${text.toLowerCase()}`} passHref>
      <div className="flex ">
        <div className="group flex  cursor-pointer justify-center rounded-full p-3 text-black transition-all  duration-300 hover:bg-slate-100 dark:hover:bg-slate-500 lg:mr-auto ">
          <Icon className="h-[1.5rem] w-[1.5rem] dark:fill-white " />
          <p className="hidden pl-3  group-hover:text-blue-400 dark:text-white lg:inline  ">
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default SideBarItem;
