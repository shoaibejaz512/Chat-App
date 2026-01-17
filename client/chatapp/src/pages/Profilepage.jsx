import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useAuthContext } from "../context/AuthContext";

const Profilepage = () => {
  const { authUSer, updateProfile } = useAuthContext();

  const [seletedImage, setseletedImage] = useState(null);
  const [name, setname] = useState(authUSer.fullName);
  const [bio, setbio] = useState(authUSer.bio);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seletedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(seletedImage);
    reader.onload = async () => {
      const baseImage = reader.result;
      await updateProfile({ profilePic: baseImage, fullName: name, bio });
      navigate("/");
    };
  };

  console.log(authUSer.profilePic);

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl  backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse  rounded-lg">
        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile Detials</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setseletedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                seletedImage
                  ? URL.createObjectURL(seletedImage)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${seletedImage && "rounded-full"}`}
              alt=""
            />
            <strong>upload profile image</strong>
          </label>
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            type="text"
            required
            placeholder="your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
          <textarea
            placeholder="Write profile bio"
            required
            rows={5}
            onChange={(e) => setbio(e.target.value)}
            value={bio}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer "
          >
            Save
          </button>
        </form>
        <img
          src={authUSer.profilePic || assets.logo_icon}
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10  ${
            seletedImage && "rounded-full"
          }`}
          alt=""
        />
      </div>
    </div>
  );
};

export default Profilepage;
