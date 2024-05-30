import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BiX } from "react-icons/bi";
import {
  editProfileModal,
  profileDataChainging,
} from "../Redux/features/GlobalSlice";
import axiosAPI from "../axios";
import { profileType } from "../Types/Feed.types";
import { RootState } from "../Redux/app/store";

const styles = {
  div: " border m-2 rounded-md p-1  ",
  caption: " text-gray-500 text-[0.7rem]    ",
  input: " outline-none w-full pr-4  px-1 text-twitter  ",
};

function EditProfileModal() {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({} as profileType);
  const { profile } = useSelector((state: RootState) => state.blockchain);
  const { userId, avatar } = profile;

  useEffect(() => {
    // -------------------------------------------- fetching Profile Data --------------------
    async function fetchProfileData() {
      const profileData = await axiosAPI
        .post("/profiledata", JSON.stringify({ userId: userId }))
        .then((res) => res.data);
      setProfileData(profileData);
    }
    fetchProfileData();
  }, []);

  const [data, setData] = useState<profileType>({
    name: "",
    bio: "",
    location: "",
    website: "",
    userId: userId,
    birthDate: new Date(),
    userImage: avatar,
    backgroundImage: "",
  });
  useEffect(() => {
    profileData &&
      setData({
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        userId: userId,
        birthDate: new Date(),
        userImage: avatar,
        backgroundImage: profileData.backgroundImage,
      });
  }, [profileData, profile]);
  const editProfileModalState = useSelector(
    (state: any) => state.global.editProfileModalState
  );

  async function handleSave() {
    const res = await fetch("http://localhost:8001/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    dispatch(editProfileModal());
    dispatch(profileDataChainging());
  }

  return (
    <div
      className={` absolute inset-0 flex items-center justify-center bg-black/40   ${
        editProfileModalState ? " inline " : " hidden "
      }   `}
    >
      <div className="min-h-[30rem] min-w-[35rem] rounded-xl bg-white   ">
        <div className="flex items-center gap-4 p-2 ">
          <BiX
            onClick={() => dispatch(editProfileModal())}
            title="Close"
            className="h-[2rem] w-[2rem] rounded-full hover:bg-gray-300   "
          />
          <p className="text-[1.3rem] font-bold   ">Edit Profile</p>
          <button
            onClick={handleSave}
            className="ml-auto rounded-full bg-black p-2 px-6 text-white opacity-80 hover:opacity-100   "
          >
            Save
          </button>
        </div>
        <div className={styles.div}>
          <p className={styles.caption}>Name</p>
          <input
            className={styles.input}
            onChange={(e) =>
              setData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={data.name}
          ></input>
        </div>
        <div className={styles.div}>
          <p className={styles.caption}>Bio</p>
          <input
            className={styles.input}
            onChange={(e) =>
              setData((prev) => ({ ...prev, bio: e.target.value }))
            }
            value={data.bio}
          ></input>
        </div>
        <div className={styles.div}>
          <p className={styles.caption}>Location</p>
          <input
            className={styles.input}
            onChange={(e) =>
              setData((prev) => ({ ...prev, location: e.target.value }))
            }
            value={data.location}
          ></input>
        </div>
        <div className={styles.div}>
          <p className={styles.caption}>Website</p>
          <input
            className={styles.input}
            onChange={(e) =>
              setData((prev) => ({ ...prev, website: e.target.value }))
            }
            value={data.website}
          ></input>
        </div>
        {/* <div className={styles.div}>
          <p className={styles.caption}>new User Id</p>
          <input
            className={styles.input}
            onChange={(e) =>
              setData((prev) => ({ ...prev, newUserId: e.target.value }))
            }
            value={data.newUserId}
          ></input>
        </div> */}
        <div className={styles.div}>
          <p className={styles.caption}>backgroundImage Url</p>
          <input
            className={styles.input}
            onChange={(e) =>
              setData((prev) => ({ ...prev, backgroundImage: e.target.value }))
            }
            value={data.backgroundImage}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
