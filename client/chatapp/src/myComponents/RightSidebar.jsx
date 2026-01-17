import React, { useEffect, useState } from 'react'
import img1 from "../assets/avatar_icon.png"
import {imagesDummyData} from "../assets/assets"
import { useChatContext } from '../context/ChatContext'
import { useAuthContext } from '../context/AuthContext'

const RightSidebar = () => {
  const {selectedUser,messages} = useChatContext();
  const {onLineUser,logOut} = useAuthContext();
  const [msgImages, setmsgImages] = useState([]);


  //get all the images from the messages and set it into state
  useEffect(() =>{
    setmsgImages(
      messages.filter((msg) => msg.image).map((msg) => msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 [&::-webkit-scrollbar]:hidden  text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden":""}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-bold mx-auto'>
        <img src={selectedUser?.profilePic || img1} alt="" className='w-20 aspect-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
         {onLineUser.includes(selectedUser._id) ? <p className='w-2 h-2 capitalize rounded-full bg-green-500'></p> :<p className='w-2 h-2 rounded-full bg-gray-200'></p> } 
          {selectedUser.fullName}</h1>
        <p className='px-10 mx-auto font-semibold text-[1rem] capitalize'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] mx-2 my-4 border-2'/>
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[300px] overflow-y-scroll  [&::-webkit-scrollbar]:hidden grid grid-cols-2  gap-4 opacity-80'>
          {msgImages.map((url,i) => (
            <div key={i} onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt=""  className='h-full rounded-md'/>
            </div>
          ))}
        </div>
      </div>
      <button className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-md font-semibold py-2 px-20 rounded-full cursor-pointer'>
        LogOut
      </button>
    </div>
  )
}

export default RightSidebar