import React from "react";
import ReactDOM from "react-dom"; // Thay đổi từ "react-dom/client" thành "react-dom"
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/chat.provider";
import { WebSocketProvider } from "./context/websocket.provider"; 

ReactDOM.render(
  <BrowserRouter>
    <WebSocketProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </WebSocketProvider>
  </BrowserRouter>,
  document.getElementById("root") 
);


reportWebVitals();
