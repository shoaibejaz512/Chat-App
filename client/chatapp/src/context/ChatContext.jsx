import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({ children }) => {
  const [messages, setmessages] = useState([]);
  const [users, setusers] = useState([]);
  const [selectedUser, setselectedUser] = useState(null);
  const [unseenMessages, setunseenMessages] = useState({});

  const { socket, axios } = useAuthContext();

  //---------function to get all users---------------------
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setusers(data.users);
        setunseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //get messages for selected users
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setmessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //-------------------function to send messages to selected users--------------
  const sendMessages = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setmessages((prevMsg) => [...prevMsg, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //--------------------function to subscribe messages for selected user------------
  const subscribeToMessage = async () => {
    if (!socket) return;
    socket.on("newMessage", async (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        sendMessages((prevMsg) => [...prevMsg, newMessage]);
        const { data } = await axios.put(
          `/api/messages/mark/${newMessage._id}`
        );
      } else {
        setunseenMessages((prevMsg) => ({
          ...prevMsg,
          [newMessage.senderId]: prevMsg[newMessage.senderId]
            ? prevMsg[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  //--------------------function to unsubscribe messages from user--------------------
  const unSubscribeFromMessages = async () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessage();
    return () => {
      unSubscribeFromMessages();
    };
  }, [socket,selectedUser]);

  let value = {
    messages,
    selectedUser,
    setselectedUser,
    unseenMessages,
    users,
    getUsers,
    getMessages,
    sendMessages,
    subscribeToMessage,
    unSubscribeFromMessages,
    setunseenMessages
  };
  return <ChatContext.Provider value={value}>
    {children}
    </ChatContext.Provider>;
};
