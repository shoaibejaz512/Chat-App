import { useContext, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendURL = import.meta.env.VITE__BACKEND__URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [Token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [socket, setsocket] = useState(null);
  const [authUSer, setauthUSer] = useState(null);
  const [onLineUser, setonLineUser] = useState([]);
  const [loading, setLoading] = useState(true);

  //check if the user is authenticated and if so , set the user data and connect the socekt
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setauthUSer(data.user);
        connectScoket(data.user);
      } else {
        setauthUSer(null);
      }
    } catch (error) {
      setauthUSer(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!Token) {
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${Token}`; // ✅ MOVE THIS UP
    checkAuth();
  }, [Token]);

  //handle login to handle user authenticate and socket connection
  const login = async (state, credential) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credential);
      if (data.success) {
        setauthUSer(data.user); // ✅ NOT userData
        connectScoket(data.user);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem("token", JSON.stringify(data.token));
        if (state == "signup") {
          toast.success("Account Created Successfully");
        } else if (state == "login") {
          toast.success("Login Successfully");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //user logout function to handle user and socket disconnect
  const logOut = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setauthUSer(null);
    setonLineUser([]);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logout successfully");
    socket?.disconnect();
  };

  //update user profile function to handle user profile updates
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setauthUSer(data.user);
        toast.success("profile updated successfully");

        // 🔥 IMPORTANT: refresh sidebar users
        window.dispatchEvent(new Event("profile-updated"));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //connect socket function to handle  sckoet connection and online users
  const connectScoket = (userData) => {
    if (!userData || socket?.connected) return;
    let newSocket = io(backendURL, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setsocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setonLineUser(userIds);
    });
  };

  const Value = {
    axios,
    Token,
    socket,
    authUSer,
    onLineUser,
    login,
    logOut,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={Value}>{children}</AuthContext.Provider>;
};
