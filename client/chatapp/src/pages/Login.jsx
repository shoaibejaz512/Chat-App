import React, { useState } from "react";
import "../stylesheet/login.css";
import LoginForm from "../myComponents/LoginForm";
import arrowIcon from "../assets/arrow_icon.png";
import logo from "../assets/logo_big.svg";
import { useAuthContext } from "../context/AuthContext";

const Login = () => {
  const [currstate, setcurrstate] = useState("Sign Up");
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [bio, setbio] = useState("");
  const [isDataSubmitted, setisDataSubmitted] = useState(false);

  const { login } = useAuthContext();

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currstate === "Sign Up" && !isDataSubmitted) {
      setisDataSubmitted(true);
      return;
    }
    if (currstate === "Sign Up") {
      login("signup", {
        fullName: name,
        email,
        password,
        bio,
      });
    } else {
      login("login", {
        email,
        password,
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-10 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* --------------------left-------------- */}
      <img src={logo} alt="" className="w-[min(30vw,250px)]" />
      {/* --------------------right-------------- */}
      <form
        onSubmit={onSubmitHandler}
        action=""
        className="w-1/4 border-2 bg-white/8 text-white text-gray-600 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currstate}
          {isDataSubmitted && (
            <img
              onClick={() => setisDataSubmitted(false)}
              src={arrowIcon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currstate === "Sign Up" && !isDataSubmitted && (
          <input
            name="fullName"
            value={name}
            onChange={(e) => setname(e.target.value)}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "
            placeholder="Full Name..."
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              placeholder="Enter email"
              required
            />
            <input
              name="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              placeholder="Enter password"
              required
            />
          </>
        )}

        {isDataSubmitted && currstate === "Sign Up" && (
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setbio(e.target.value)}
            placeholder="enter bio..."
            rows={2}
            cols={5}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer font-medium"
        >
          {currstate === "Sign Up" ? "Create Account" : "Login Account"}
        </button>

        <div className="flex items-center gpa-5 text-sm text-gray-300">
          <input type="checkbox" />
          <p>Agree to the terms of use and privacy policy</p>
        </div>

        <div className="flex flex-col gap-2">
          {currstate === "Sign Up" ? (
            <p className="text-sm text-gray-400">
              Already have an account{" "}
              <span
                onClick={() => {
                  setcurrstate("login");
                  setisDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>{" "}
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Create Account here{" "}
              <span
                onClick={() => {
                  setcurrstate("Sign Up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
