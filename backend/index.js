import express from "express";
import http from "http";
import WebSocket from "ws";
import {
  joinRoom,
  leaveRoom,
  createRoom,
  answerQuestion,
  startGame,
  startDraw,
  endPlayTime,
  getAllUserByRoomId,
  getAllRooms,
  broadcastToRoom,
  sendMessage,
  handleBrushStroke
} from "./controllers/room.controller.js";
import { createUser } from "./controllers/user.controller.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 6789;

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case "create_user":
          createUser(data.username, data.isAdmin, data.status, ws);
          break;
        case "create_room":
          createRoom(data, ws, data.userId);
          break;
        case "join_room":
          joinRoom(data, ws, WebSocket);
          break;
        case "leave_room":
          leaveRoom(data, WebSocket);
          break;
        case "send_message":
          sendMessage(data.roomId, data.message, WebSocket, data.userId);
          break;
        case "answer_question":
          answerQuestion(data.roomId, data.userId, data.message, WebSocket);
          break;
        case "start_game":
          startGame(WebSocket, data.roomId);
          break;
        case "start_draw":
          startDraw(WebSocket, data.room);
          break;
        case "end_play_time":
          endPlayTime(WebSocket, data.roomId);
          break;
        case "get_all_user":
          getAllUserByRoomId(ws, data.roomId);
          break;
        case "room_list":
          getAllRooms(ws);
          break;
        case "leave_room":
          leaveRoom(data, WebSocket);
          break;
        case "brush_stroke":
          handleBrushStroke(data.roomId, data, WebSocket);
          break;
        default:
          console.warn("Unhandled message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send(JSON.stringify({ error: "Invalid message format." }));
    }
  });

  ws.on("close", (mesage) => {
    //  leave room

    console.log("Client disconnected");
    // Optional: handle disconnection cleanup if needed
  });
});

// Function to broadcast a message to all clients in a specific room

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
