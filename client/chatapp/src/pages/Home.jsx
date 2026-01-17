import React, { lazy, Suspense, useState } from 'react'
import { useChatContext } from '../context/ChatContext.jsx';


const SideBar = lazy(() => import("../myComponents/SideBar.jsx"));
const ChatContainer = lazy(() => import("../myComponents/ChatContainer.jsx"));
const RightSidebar = lazy(() => import("../myComponents/RightSidebar.jsx"))

const Home = () => {

  const {setselectedUser} = useChatContext()

  return (
    <div className='w-full h-screen text-white  border sm:px-[5%] sm:py-[2%]'>
      <div className={`border-2 backdrop-blur-xl border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${setselectedUser ? 'md:grid-cols-[1fr_1,5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Suspense fallback={<p>loadding....</p>}>
          <SideBar />
        </Suspense>
        <Suspense fallback={<p>loading.....</p>}>
          <ChatContainer/>
        </Suspense>
        <Suspense fallback={<p>loading.....</p>}>
          <RightSidebar  />
        </Suspense>
      </div>
    </div>
  )
}

export default Home