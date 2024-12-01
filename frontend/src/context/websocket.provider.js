import React, { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "./chat.provider";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (!userInfo) {
      console.log("User not logged in, navigating to login.");
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket("ws://localhost:6789");
    setSocket(ws.current);
    ws.current.onopen = () => {
      localStorage.clear();
      console.log("WebSocket Connected");
    };

    ws.current.onclose = () => {
      localStorage.clear();
      console.log("WebSocket Disconnected");
    };

    ws.current.onmessage = (event) => {
      console.log(event.data.message);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      // Close connection when component unmounts
      ws.current.close();
    };
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ socket, messages, setMessages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
