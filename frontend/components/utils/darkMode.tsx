import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/app/store";
import { toggleDarkMode } from "../../Redux/features/GlobalSlice";

function DarkMode() {
  const { isDarkMode } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();
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
      <label className="inline-flex cursor-pointer items-center">
        <input
          onClick={handleDarkMode}
          type="checkbox"
          value=""
          className="peer sr-only"
        />
        <div className="peer relative h-6 w-11 rounded-full bg-black after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"></div>
        {/* <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Toggle Dark Mode
        </span> */}
      </label>
    </div>
  );
}

export default DarkMode;
