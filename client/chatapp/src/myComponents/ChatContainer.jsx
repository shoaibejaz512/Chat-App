import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/profile_martin.png";
import img2 from "../assets/arrow_icon.png";
import img3 from "../assets/help_icon.png";
import img4 from "../assets/logo_icon.svg";
import img5 from "../assets/avatar_icon.png";
import img6 from "../assets/send_button.svg";
import img7 from "../assets/gallery_icon.png";

import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib2/utils";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setselectedUser, getMessages, sendMessages } =
    useChatContext();
  const [input, setinput] = useState("");
  const { authUSer, onLineUser } = useAuthContext();

  const scrollEnd = useRef();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (input.trim() == "") return null;
    await sendMessages({ text: input.trim() });
    setinput("");
    toast.success("message send successfully");
  };

  //--handle sending imge
  const handleSendImage = async (e) => {
    let file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Selecte a image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async (e) => {
      await sendMessages({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
     toast.success("message send successfully");
  };

  return selectedUser ? (
    <div className="h-full  relative backdrop-blur-lg overflow-hidden">
      {/* ---------------------------------header code ----------------------------- */}

      <div className="flex items-center gap-3 py-3 mx-4 border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg flex items-center gap-2">
          {selectedUser.fullName}
          {onLineUser.includes(selectedUser._id) ? (
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
          )}
        </p>
        <img
          onClick={() => setselectedUser(null)}
          src={img2}
          alt=""
          className="max:hidden max-w-7 cursor-pointer"
        />
        <img
          src={img3}
          alt=""
          className="max-md:hidden cursor-pointer max-w-5"
        /> 
      </div>

<div className="w-[98%] mx-auto h-1 bg-gray-300/20"></div>
      {/* ----------------------------------chat area code----------------------- */}

      <div className="flex flex-col  h-full overflow-y-scroll  [&::-webkit-scrollbar]:hidden  p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={` flex my-3  w-full  items-end gap-2 ${
              msg.senderId === authUSer._id ? "justify-end" : "justify-start  "
            }`}
          >
            {msg.image ? (
              <img src={msg.image} alt="" className="w-[200px] rounded-[10px] right-0" />
            ) : (
              <p
                className={`p-2 max-w-[200px]  md:text-sm font-semibold rounded-lg mb-8 break-all bg-violet-500/30  text-white ${
                  msg.senderId === authUSer._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUSer._id
                    ? authUSer?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        {/* <div ref={scrollEnd}></div> */}
      </div>

      {/* -----------------------------------------bottom area-------------------------------- */}
      <div className="absolute z-[999] bottom-0 left-0 bg-[#0b0b0b21] backdrop-blur-2xl right-0 flex items-center  gap-3 p-3">
        <div className="flex-1 items-center flex bg-gray-100/30 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setinput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessageHandler(e);
              } else {
                return;
              }
            }}
            className="flex-1 text-md font-bold py-2 border-none rounded-lg  outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png , image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img src={img7} className="w-5 cursor-pointer mr-2" alt="" />
          </label>
        </div>
        <img
          src={img6}
          onClick={sendMessageHandler}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2 text-gray-500 backdrop-blur-lg bg-white/10 max-md:hidden">
      <img src={img4} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat Any Time Any Where</p>
    </div>
  );
};

export default ChatContainer;
