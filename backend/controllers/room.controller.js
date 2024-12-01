import { Room } from "../models/room.model.js";
import { getUserById } from "./user.controller.js";
import { Answer } from "../models/message.model.js";
import { v4 as uuidv4 } from "uuid";
import { KEYWORD } from "../config/constant.key.js";
const rooms = {};
const roomIds = [];
let count = 0;
const findUserInRoom = (userId, roomId) => {
  if (!rooms[roomId]) return null;
  const user = getUserById(userId);
  return user ? user : null;
};

const joinRoom = (data, ws, WebSocket) => {
  const { roomId, userId } = data;

  if (!rooms[roomId]) {
    console.error("Room not found");
    return;
  }
  const user = getUserById(userId);
  const isUserExist = rooms[roomId]?.users.find(
    (item) => user.userId === item.userId
  );

  if (user && !isUserExist) {
    rooms[roomId].users.push(user);
    rooms[roomId].wss.push(ws);

    // kiểm tra đủ từ 2 người trở đi có thể bắt đầu chơi 
    if (rooms[roomId].users.length > 1 && rooms[roomId].status == "OPEN")
      rooms[roomId].status = "ENABLESTART"

    broadcastToRoom(
      roomId,
      {
        type: "new_join",
        message: `${user.name} has joined the room`,
        room: rooms[roomId],
      },

      WebSocket
    );
    ws.send(JSON.stringify({ data: { room: rooms[roomId], user }, type: "join_room" }));
  }
};

const leaveRoom = (data, WebSocket) => {
  const { roomId, userId } = data;
  if (!rooms[roomId]) {
    console.log(rooms);
    console.error("Room not found");
    return;
  }
  const userLeft = getUserById(userId);
  rooms[roomId].users = rooms[roomId].users.filter(
    (user) => user.userId !== userId
  );
  broadcastToRoom(
    roomId,
    {
      type: "notification",
      message: `User ${userLeft.name}: left the room.`,
    },
    WebSocket
  );
};

const createRoom = (data, ws, userId) => {
  const { name, status } = data;
  const roomId = uuidv4();
  const room = new Room(roomId, name, status);
  room.wss.push(ws);
  rooms[roomId] = room;
  const user = getUserById(userId);
  user.isAdmin = true;
  rooms[roomId].users.push(user);
  rooms[roomId].adminId = userId
  roomIds.push(roomId);
  const message = {
    room: rooms[roomId],
    user: user
  };

  ws.send(JSON.stringify(message));
};

const sendMessage = (roomId, message, WebSocket, userId) => {
  const userSend = getUserById(userId);
  broadcastToRoom(
    roomId,
    {
      type: "message",
      message: `User ${userSend.name}:${message}`,
    },
    WebSocket
  );
};

const broadcastToRoom = (roomId, message, WebSocket) => {
  console.log(message);
  if (rooms[roomId]) {
    rooms[roomId].wss.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ data: message, type: "every_one" }));
      }
    });
  }
};

const answerQuestion = (roomId, userId, message, WebSocket) => {
  console.log("ĐÂY LÀ ANSWER nhân được", message)
  const isCorrect = rooms[roomId].keyword === message
  const user = getUserById(userId);
  if (user) {

    if (isCorrect) {
      user.canAnswer = false
      user.diem += 1;
    }
    broadcastToRoom(
      roomId,
      {
        type: "answer",
        answer: isCorrect ? true : false,
        message: `${user.name} answered${isCorrect ? " correctly" : `: ${message}`}.`,
        users : rooms[roomId].users
      },
      WebSocket
    );
    // const message = {
    //   data: user.diem
    //   // diem: user.diem
    // };

    // WebSocket.send(JSON.stringify(message));
    // WebSocket.send(JSON.stringify( { data: user.diem, type: "update score" }));
    // { data: {room: rooms[roomId] , user}, type: "join_room" }
  }
};
const startGame = (WebSocket, roomId) => {
  const randomNumber = Math.floor(Math.random() * 50) + 1;
  rooms[roomId].keyword = KEYWORD[randomNumber];
  rooms[roomId].playTimes = rooms[roomId].users.length;
  const index = Math.floor(Math.random() * rooms[roomId].playTimes) + 1;
  const userEdit = rooms[roomId].users[index - 1];

  const users = rooms[roomId].users.map((user) => {
    user.isEdit = false;
    user.canAnswer = true;
    if (user.userId === userEdit.userId) {
      user.isEdit = true;
      user.canAnswer = false;
    }
    return user;
  });
  rooms[roomId].users = users;
  rooms[roomId].status = "STARTED";
  broadcastToRoom(
    roomId,
    {
      type: "start",
      message: `Game start. ${userEdit.name} will draw for everyone guess`,
      userEditId: userEdit,
      room: rooms[roomId],
      users: users
    },
    WebSocket
  );


};
// const waitForAnswerStatus = (roomId) => {
//   return new Promise((resolve) => {
//     const checkStatus = setInterval(() => {
//       if (rooms[roomId].status === "ANSWER") {
//         clearInterval(checkStatus);
//         resolve();
//       }
//     }, 1000); // Kiểm tra mỗi 1 giây
//   });
// };
const startDraw = async (WebSocket, room) => {
  rooms[room.roomId].isDraw = true;
  broadcastToRoom(
    room.roomId,
    {
      type: "is_draw",
      room: rooms[room.roomId],
    },
    WebSocket
  );

  // Đợi cho setTime thực thi xong trước khi tiếp tục
  const check = await setTime(WebSocket, room.roomId);

  if (check === 1) {
    rooms[room.roomId].isDraw = false;
    rooms[room.roomId].status = "ANSWER";
    console.log("KẾT THÚC 1 TURN");
    count++;
    rooms[room.roomId].count = count
    if (count === rooms[room.roomId].playTimes) {
      rooms[room.roomId].status = "ENDGAME"
      count = 0
      broadcastToRoom(
        room.roomId,
        {
          type: "end_game",
          message: `End game`,
          room: rooms[room.roomId]
          // userEditId: userEdit,
        },
        WebSocket
      );
    }
    else
      broadcastToRoom(
        room.roomId,
        {
          type: "end_turn",
          room: rooms[room.roomId],
        },
        WebSocket
      );


  }
};

const setTime = async (WebSocket, roomId) => {
  return new Promise((resolve) => {
    let startTime = Date.now();
    const duration = 10000;
    let checkTime = 0;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newPercentage = Math.max(0, 100 - (elapsed / duration) * 100);

      broadcastToRoom(
        roomId,
        {
          type: "remaining_time",
          newPercentage,
        },
        WebSocket
      );

      if (newPercentage === 0) {
        clearInterval(interval);
        checkTime = 1;  // Đánh dấu kết thúc
        resolve(checkTime);  // Trả về giá trị khi thời gian kết thúc
      }
    }, 500);
  });
};
const endPlayTime = (WebSocket, roomId) => {
  if (count === rooms[roomId].playTimes) {
    rooms[roomId].playTimes.status
    broadcastToRoom(
      roomId,
      {
        type: "END",
        message: `End game`,
        userEditId: userEdit,
      },
      WebSocket
    );
  }
  // else if (count + 1 < rooms[roomId].playTimes) {
  //   startGame(WebSocket, roomId);
  // }
};
const getAllUserByRoomId = (ws, roomId) => {
  console.log(roomId);
  ws.send(JSON.stringify({ data: rooms[roomId]?.users, type: "user_list" }));
};
const getAllRooms = (ws) => {
  const list = roomIds.reduce((pre, curr) => {
    return [...pre, rooms[curr]];
  }, []);
  ws.send(JSON.stringify({ data: list, type: "room_list" }));
};
const handleBrushStroke = (roomId, brushData, WebSocket) => {
  // Broadcast brush stroke data to all users in the specified room
  console.log("HÀM GỬI NÉT VẼ ĐÃ ĐƯỢC GỌI")
  broadcastToRoom(roomId, { type: "brush_stroke", brushData }, WebSocket);
};
export {
  getAllRooms,
  handleBrushStroke,
  findUserInRoom,
  joinRoom,
  leaveRoom,
  createRoom,
  broadcastToRoom,
  answerQuestion,
  startGame,
  startDraw,
  endPlayTime,
  getAllUserByRoomId,
  sendMessage,
};
