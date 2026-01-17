import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import {Toaster} from "react-hot-toast"
import { useAuthContext } from './context/AuthContext'
 
const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const ProfilePage = lazy(() => import("./pages/Profilepage"))

const App = () => {
  const  { authUSer,loading } = useAuthContext();

    // ✅ WRITE HERE (VERY IMPORTANT)
  if (loading) {
    return (
      <p className="text-white text-center mt-20">
        Checking authentication...
      </p>
    );
  }else{
  return (
    <div className="bg-[url('/bgImage.svg')] w-full h-screen object-cover">
      <Toaster/>
        <Routes>
          {/* <Route path='/create' element={
            <Suspense fallback={<p>loading...</p>}>
               {!authUSer ? <Login /> : <Navigate to={"/"}/> }
            </Suspense>
          } /> */}

          <Route path='/login' element={
            <Suspense fallback={<p>loading...</p>}>
            {!authUSer ? <Login /> : <Navigate to={"/"}/>}
            </Suspense>
          } />

          <Route path='/' element={
            <Suspense fallback={<p>loading....</p>}>
              {authUSer ? <Home /> :  <Navigate to={"/login"}/> }
            </Suspense>
          } />

           <Route path='/profile' element={
            <Suspense fallback={<p>loading....</p>}>
              {authUSer ? <ProfilePage /> : <Navigate to={"/login"}/>}
            </Suspense>
          } />
          
        </Routes>
    </div>
  )
}
}

export default App