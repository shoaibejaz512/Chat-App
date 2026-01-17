import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { animate, motion } from "motion/react"
import "../stylesheet/login.css"
import { useAuthContext } from '../context/AuthContext';


const LoginForm = () => {


    const { login } = useAuthContext();
    const [username, setusername] = useState("")
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [bio, setbio] = useState("")
    const [isShow, setisShow] = useState(false);
    const loginBtnText = useRef(null);
    const navigate = useNavigate();



    // useEffect(() => {
    //     let isSignup = localStorage.getItem("isCreated");
    //     if (!isSignup) {
    //         return navigate("/create", { replace: true })
    //     }

    //     navigate("/");
    // }, [])

    const startAnimation = async () => {


        if (email && password) {

            await animate(".loader", {
                opacity: 1,
                width: "24px",
            }, {
                duration: .2,
                ease: 'easeInOut'
            })

            await animate(".loader", {
                rotate: 360 * 4,
            }, {
                duration: 1.2
            })
            await animate(".loader", {
                opacity: 0,
            }, {
                duration: .6
            })
            await animate(".text", {
                opacity: 0,
                display: "none",
            }, {
                duration: .3,
                ease: "easeInOut"
            })
            await animate(".icon", {
                opacity: 1,
            })
            animate(".icon path", {
                pathLength: 1,
            }, {
                duration: .4,
                ease: "easeInOut"
            })
            setTimeout(() => {
                navigate("/create")
            }, 800);
        }





    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) return;

        login("singup", { email, password });

        setemail("");
        setpassword("");
    };


    const showPassword = () => {
        if (password.length > 0) {
            setisShow(!isShow)
        }
    }

    return (
        <>
            <form action="" onSubmit={handleSubmit} className='absolute  w-full h-full px-5  flex gap-2 justify-center items-center text-white flex-col'>
                <h1 className='text-[2rem] font-extrabold text-[#06b6d4] font-[font2] '>Create Account</h1>

                {/* --------------------------------username------------------------- */}
                <div className="username w-full relative">
                    <label htmlFor="username" className='text-[1.2rem]  font-bold text-cyan-400'>Username</label>
                    <input
                        name='username'
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                        type="text"
                        className='w-full bg-transparent text-cyan-500 px-3 py-2  rounded-[5px] outline-none text-[1.6rem] font-semibold border-2 border-cyan-400' />
                </div>


                {/* -------------------------------------email---------------------------- */}
                <div className="email w-full relative">
                    <label htmlFor="email" className='text-[1.2rem]  font-bold text-cyan-400'>Email</label>
                    <input
                        name='email'
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        type="email"
                        className='w-full bg-transparent text-cyan-500 px-3 py-2  rounded-[5px] outline-none text-[1.6rem] font-semibold border-2 border-cyan-400' />
                </div>
                <div>


                    {currstate === "singup" ?
                        <div className='w-[100%]'>
                            {/* -------------------------------------password------------------------------------ */}
                            <div className="password w-full relative ">
                                <button type='button' onClick={showPassword} className="cursor-pointer show-password absolute right-3 top-[50%] text-cyan-400 text-[1.2rem] font-bold ">{isShow ? "hide" : "show"}</button>
                                <label htmlFor="password" className='text-[1.4rem] font-semibold text-cyan-400'>password</label>
                                <input
                                    name='password'
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                    type={isShow ? "text" : "password"}
                                    className='w-full bg-transparent text-cyan-500 text-[1.6rem] rounded-[5px] outline-none px-3 py-2 font-semibold border-2 border-cyan-400' />
                            </div>


                            {/* -------------------------------------bio--------------------------------------------- */}
                            <div className="bio w-full relative ">
                                <label htmlFor="bio" className='text-[1.4rem] font-semibold text-cyan-400'>bio</label>
                                <textarea
                                    name='bio'
                                    value={bio}
                                    onChange={(e) => setbio(e.target.value)}
                                    rows={2}
                                    cols={10}
                                    className='w-full text-cyan-500 text-[1.6rem] rounded-[5px] outline-none px-3 py-2 font-semibold border-2 border-cyan-400' />
                            </div>



                            <div className="forget  relative w-full my-3">
                                <a href="#" className='decoration-none text-[1rem] font-semibold text-cyan-400 absolute right-0 top-[-18px]'><span>Forget Password</span></a>
                            </div>
                        </div>
                        : ""}
                </div>

                <motion.button onClick={startAnimation} ref={loginBtnText} type="submit" className='  login-btn w-full flex gap-2 justify-center items-center  h-[50px] font-[font2] tracking-[2px] bg-cyan-500 hover:bg-cyan-600 duration-300  text-white text-[1.4rem] font-extrabold cursor-pointer rounded-[4px] py-2 relative'>
                    <motion.svg xmlns="http://www.w3.org/2000/svg" className="loader opacity-0" width="0" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <motion.path
                            d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9" />
                        <path d="M17 12a5 5 0 1 0 -5 5" /></motion.svg>
                    <span className='text'>Create Account</span>
                    <motion.svg
                        style={
                            { opacity: 0 }
                        }
                        className="icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <motion.path
                            initial={
                                {
                                    pathLength: 0
                                }
                            }
                            transition={{
                                duration: .4,
                                type: "tween",
                                ease: "easeOut"
                            }}
                            d="M5 12l5 5l10 -10" />
                    </motion.svg>

                </motion.button>
                <div className="para mt-3 relative w-full flex justify-center items-start">
                    <Link to='/create' className='text-[1rem] absolute top-[-15px]  font-bold decoration-none'>Don't have an <span className='text-cyan-400'>account?</span></Link>
                </div>


            </form >
        </>
    )
}

export default LoginForm