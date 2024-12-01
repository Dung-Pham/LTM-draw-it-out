import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebSocketContext from "./websocket.provider";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [roomId, setRoomId] = useState([]);
  const [rooms, setRooms] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [fullRooms, setFullRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState();
  const [isWait, setIsWait] = useState(true);
  const [percentage, setPercentage] = useState(100);
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const { ws } = useContext(WebSocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };
    }
  }, [ws, users]); // Add `ws` as a dependency to ensure it’s set before attaching the event listener

  // const userInfo = JSON.parse(localStorage.getItem("user"));
  // if (!userInfo) {
  //   navigate("/login");
  // }

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        roomId,
        setRoomId,
        users,
        setUsers,
        messages,
        setMessages,
        setRooms,
        rooms,
        fullRooms,
        drawing,
        setFullRooms,
        selectedRoom,
        setSelectedRoom,
        setDrawing,
        isWait, setIsWait,
        percentage, setPercentage,
        answers, setAnswers,
        score, setScore
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for accessing ChatContext
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
