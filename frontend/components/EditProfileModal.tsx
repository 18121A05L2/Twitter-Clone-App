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
import { PINATA_GATEWAY_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { setProfile } from "../Redux/features/BlockchainSlice";
import { Spinner } from "./utils/svgs";

const styles = {
  div: " border m-2 rounded-md p-1  ",
  caption: " text-gray-500 text-[0.7rem]    ",
  input: " outline-none w-full pr-4  px-1 text-twitter dark:bg-black  ",
};

function EditProfileModal() {
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const { profile, twitterContract, walletAddress } = useSelector(
    (state: RootState) => state.blockchain
  );
  const { profileDataChanged, editProfileModalState } = useSelector(
    (state: RootState) => state.global
  );
  console.log({ profile });
  const { userId, avatar } = profile;

  useEffect(() => {
    //updating the profile if data changes
    (async () => {
      const nftUri = await twitterContract?.getProfile(walletAddress);

      if (nftUri) {
        const profileRes = await fetch(nftUri).then((res) => res.json());
        dispatch(setProfile({ ...profileRes, address: walletAddress }));
      }
    })();
  }, [profileDataChanged]);

  const [data, setData] = useState<profileType>({
    name: "",
    bio: "",
    location: "",
    website: "",
    userId: userId,
    birthDate: new Date(),
    avatar: avatar,
    backgroundImage: "",
    address: walletAddress,
  });
  useEffect(() => {
    profile &&
      setData((prev) => ({
        ...prev,
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        userId: userId,
        birthDate: new Date(),
        avatar: avatar,
        backgroundImage: profile.backgroundImage,
      }));
  }, [profile, profile]);

  async function handleSave() {
    setIsSaving(true);
    try {
      let updatingData = { ...profile, ...data };
      const jsonRes = await axiosAPI
        .post("/uploadJsonToIpfs", JSON.stringify(updatingData))
        .then((res) => res.data);
      let tokenUri = `${PINATA_GATEWAY_URL}/${jsonRes.IpfsHash}`;
      const transactionResponse = await twitterContract?.setProfile(
        tokenUri,
        profile.nftId
      );
      await transactionResponse.wait();
      dispatch(profileDataChainging());
      await transactionResponse.wait(1);
      dispatch(editProfileModal());
      toast("profile updated successfully", { type: "success" });
    } catch (err: any) {
      console.error(err);
      toast(err?.shortMessage, { type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className={` absolute inset-0 flex items-center justify-center bg-black/40   ${
        editProfileModalState ? " inline " : " hidden "
      }   `}
    >
      <div className="min-h-[30rem] min-w-[35rem] rounded-xl bg-white dark:bg-black  dark:text-white dark:border-2 ">
        <div className="flex items-center gap-4 p-2 ">
          <BiX
            onClick={() => dispatch(editProfileModal())}
            title="Close"
            className="h-[2rem] w-[2rem] rounded-full hover:bg-gray-300   "
          />
          <p className="text-[1.3rem] font-bold   ">Edit Profile</p>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="ml-auto rounded-full bg-black p-2 px-6 text-white  dark:bg-white dark:text-black "
          >
            {isSaving ? <Spinner /> : "Save"}
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
