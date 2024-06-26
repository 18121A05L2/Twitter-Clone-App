import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";
import { toggleDarkMode } from "../../Redux/features/GlobalSlice";
import { IoMoonSharp } from "react-icons/io5";
import { RiSunFill } from "react-icons/ri";

function DarkMode() {
  const { isDarkMode } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  const handleDarkMode = () => {
    console.log({ isDarkMode });
    if (isDarkMode) {
      console.log("disbaled");
      document.documentElement.classList.remove("dark");
    } else {
      console.log("enabled");
      document.documentElement.classList.add("dark");
    }
    dispatch(toggleDarkMode());
  };
  return (
    <div className=" absolute left-5 top-5 ">
      <div
        className={` relative h-6 w-11 rounded-full bg-slate-500 ${isDarkMode && " bg-slate-200 "} `}
        onClick={handleDarkMode}
      >
        <IoMoonSharp
          className={` fill-slate-500 absolute top-[2px] start-[2px] h-5 w-5 p-[1.5px] bg-white rounded-full ${isDarkMode ? " transition-all translate-x-5 opacity-0 ease-in-out duration-700  " : " transition-all opacity-1 ease-in-out duration-700 "} `}
        />
        <RiSunFill
          className={` fill-slate-500 absolute top-[2px] start-[2px] h-5 w-5 p-[1.5px] bg-white rounded-full  ${!isDarkMode ? " transition-all opacity-0 ease-in-out duration-700  " : " opacity-1 transition-all translate-x-5 ease-in-out duration-700 "} `}
        />
      </div>
      {/* <label className="inline-flex cursor-pointer items-center">
        <input
          onClick={handleDarkMode}
          type="checkbox"
          value=""
          className="peer sr-only"
        />

        <div className="peer relative h-6 w-11 rounded-full bg-black after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600  peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full">
          {" "}
          <IoMoonSharp className=" fill-slate-500 " />
        </div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Toggle Dark Mode
        </span>
      </label> */}
    </div>
  );
}

export default DarkMode;
