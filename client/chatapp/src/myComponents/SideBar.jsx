import React, { useEffect, useState } from "react";
import img from "../assets/logo.png";
import img2 from "../assets/menu_icon.png";
import img3 from "../assets/search_icon.png";
import { useNavigate } from "react-router-dom";
import { userDummyData } from "../assets/assets";
import img4 from "../assets/avatar_icon.png";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";

const SideBar = () => {
  const {
    selectedUser,
    setselectedUser,
    users,
    getUsers,
    unseenMessages,
    setunseenMessages,
  } = useChatContext();
  const { logOut, onLineUser } = useAuthContext();
  const [input, setinput] = useState("");
  const filteredUsers = input.trim()
    ? (users || []).filter((user) =>
        user.fullName?.toLowerCase().includes(input.toLowerCase())
      )
    : users || [];

  useEffect(() => {
    getUsers();
  }, [onLineUser, unseenMessages]);

  return (
    <div
      className={`bg-[#8185B2]/10  [&::-webkit-scrollbar]:hidden  h-full p-6 rounded-r-xl overflow-y-scroll   text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={img} alt="" className="max-w-40" />
          <div className="relative py-2 group">
            <img src={img2} alt="" className="max-h-5 cursor-pointer " />
            <div className="absolute top-full right-0 z-20 w-44 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-200 hidden group-hover:block">
              <a
                href="/profile"
                className="hover:bg-[#ffffff32] px-5 py-2 rounded-[5px] duration-200 cursor-pointer"
              >
                <span className="cursor-pointer text-sm font-bold">
                  Edit Profile
                </span>
              </a>
              <hr className="my-2 border-t-2 border-gray-500" />
              <a
                href="#"
                className="hover:bg-[#ffffff32] mt-2 px-5 py-2 rounded-[5px] duration-200 cursor-pointer"
              >
                <span
                  onClick={() => logOut()}
                  className="cursor-pointer text-sm font-bold"
                >
                  logOut
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-3 py-3 px-4 mt-5">
          <img src={img3} alt="search" className="w-3" />
          <input
            onChange={(e) => setinput(e.target.value)}
            type="text"
            placeholder="search..."
            className="bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1 font-extrabold"
          />
        </div>
      </div>
      <div className="flex flex-col">
        {Array.isArray(filteredUsers) && filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setselectedUser(user);
              setunseenMessages((prev) => ({
                ...prev,[user._id]:0
              }))
            }}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic || img4}
              alt="avatar img"
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onLineUser?.includes(user._id) ? (
                <span className="text-green-400 text-xs ">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">OffLine</span>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute right-4 top-4 text-xs w-5 h-5 rounded-full flex justify-center items-center bg-violet-600/40">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
