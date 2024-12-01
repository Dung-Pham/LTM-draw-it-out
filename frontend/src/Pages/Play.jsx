import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Button,
  Divider,
  TextField,
  IconButton,
  Slider,
} from "@mui/material";
import { green } from "@mui/material/colors";
import CanvasDraw from "react-canvas-draw";
import { Circle } from "@mui/icons-material";
import { ChatState } from "../context/chat.provider";
import WebSocketContext from "../context/websocket.provider";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import DrawingCanvas from "./DrawingCanvas"
import Waiting from "./Waiting"

const Play = () => {
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatMessages1, setChatMessages1] = useState([""]);
  const [isStart, setIsStart] = useState(false);
  const [userNotNull, setUserNotNull] = useState(false);
  // const [drawing, setDrawing] = useState(false);
  const [savedData, setSavedData] = useState(""); // Add state to hold canvas data

  const { socket } = useContext(WebSocketContext);
  const {
    roomId,
    user,
    setUser,
    rooms,
    messages,
    setMessages,
    users,
    setUsers,
    drawing,
    setDrawing,
    selectedRoom,
    setSelectedRoom,
    isWait,
    setIsWait,
    percentage,
    setPercentage,
    answers, setAnswers,
    score, setScore
  } = ChatState();

  useEffect(() => {
    setUsers(selectedRoom.users)
    setIsWait(!selectedRoom.isDraw)
  }, [selectedRoom])

  // useEffect(() => {
  //   // console.log("", users)

  //   console.log("ĐÂY LÀ USERS UPDATE:", users)

  //   console.log("ĐÂY LÀ USERID UPDATE:", user.userId)
  //   const newUser = users.find((item) => item.userId === user.userId);
  //   console.log("ĐÂY LÀ USERID UPDATE:", user.userId)

  //   setUser(newUser)
  // }, [setUsers])

  // useEffect(() => {
  //   if (user) {
  //     setUserNotNull(true)
  //     console.log("USER HẾT NULL RÙI: ", user)
  //   }
  //   else setUserNotNull(false)

  // }, [user])
  useEffect(() => {
    const duration = 5000;
    console.log("ĐÂY LÀ ROOM HIỆN TẠI", selectedRoom)
    // lấy danh sách người chơi từ ChatContext chứ không phải gọi tới BE

    // lấy danh sách người chơi từ yêu cầu gọi tới BE
    console.log("ĐÂY LÀ MES TỪ BÊN ROOM CỦA CLIENT", messages)
    socket.onmessage = (message) => {
      console.log("Received message:", message);
      const res = JSON.parse(message.data);
      console.log("ĐÂY LÀ MESS GUI TOI", res.data);

      //   if (res.type === "user_list") {
      //     const userDatas = res.data?.reduce(
      //       (pre, curr) => {
      //         return [
      //           ...pre,
      //           {
      //             name: curr.name,
      //             status: curr.status,
      //             diem: curr.diem,
      //           },
      //         ];
      //       },

      //       []
      //     );
      //     setUsers(userDatas);

      //   }


      if (res.type === "every_one") {
        //cập nhâtj message
        if (res.data.type === 'message') {
          setMessages([...messages, res.data.message]);
          console.log("ĐÂY LÀ MESSAGE", messages);
        }
        // cập nhật answer
        if (res.data.type === 'answer') {
          setAnswers([...answers, res.data.message]);
          console.log("ĐÂY LÀ ANSWER", answer);
          setUsers(res.data.users)
        }
        

        // if(res.data.room.status === "ENABLESTART")
        if (res.data.type === "new_join" || res.data.type === "end_game") {
          setMessages([...messages, res.data.message]);
          setSelectedRoom(res.data.room)
        }

        if (res.data.type === "end_turn") {
          setSelectedRoom(res.data.room)
          setPercentage(100)
          let startTime = Date.now();
          const duration = 5000;
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newPercentage = Math.max(0, 100 - (elapsed / duration) * 100)
            setPercentage(newPercentage)

            if (newPercentage === 0) {
              if (selectedRoom.status !== 'ENDGAME') handleStart()
              else console.log("ĐÃ END ĐƯỢC GAME RÙI")
              // console.log("SỐ LƯỢT ĐÃ CHƠI", selectedRoom.count)
              clearInterval(interval);

            }
          }, 500);
        }
        if (res.data.type === "start") {
          setSelectedRoom(res.data.room)

          if (user.userId === res.data.userEditId.userId) setDrawing(true)
          else setDrawing(false)
          // setUsers(res.data.users)
        }

        if (res.data.type === "is_draw") {
          setSelectedRoom(res.data.room)
          console.log("TEST SAU KHI START DRAW", selectedRoom.isDraw)
          setIsWait(selectedRoom.isDraw)
        }
        if (res.data.type === "remaining_time") {
          setPercentage(res.data.newPercentage); // cập nhật thời gian còn lại
          console.log("newPercentage nhận được nè huhu: ", res.data.newPercentage)
        }
      }

      if (res.data.type === "brush_stroke") {
        if (!drawing) {
          // Handle incoming brush stroke data from other users
          canvasRef.current.loadSaveData(res.data.brushData.drawingData, true);
        }

      }
    };

  }, [selectedRoom, users, socket, messages, isStart, isWait, drawing, answers]);
  // users, socket, messages, isStart, isWait, drawing,
  // if (selectedRoom.status === 'ANSWER') {

  // }
  const handleDraw = () => {
    if (socket) {
      if (drawing && canvasRef.current) {
        const currentDrawing = canvasRef.current.getSaveData(); // Get current canvas data
        socket.send(
          JSON.stringify({
            type: "brush_stroke",
            drawingData: currentDrawing,
            roomId
          })
        );
      }
    };
  }

  const [chatMessages2, setChatMessages2] = useState([]);
  const [brushColor, setBrushColor] = useState("#000");
  const [brushSize, setBrushSize] = useState(3);
  const navigate = useNavigate();
  // useEffect(() => {
  //   setChatMessages2([...chatMessages2, ...messages]);
  // }, [messages]);
  // console.log(chatMessages2);

  const handleSendAnswer = () => {
    if (answer.trim()) {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "answer_question",
            roomId,
            userId: user.userId,
            message: answer,
          })
        );
      }

      setAnswer("");
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "send_message",
            roomId,
            userId: user.userId,
            message: message,
          })
        );
      }

      setMessage("");
    }
  };
  const handleExist = () => {
    if (socket) {
      console.log(roomId);
      socket.send(
        JSON.stringify({
          type: "leave_room",
          roomId,
          userId: user.userId,
        })
      );
      socket.onmessage = (message) => {
        console.log("Received message:", JSON.parse(message.data));
        const res = JSON.parse(message.data);
        console.log(res.data);

        if (res.type === "every_one") {
          setMessages([...messages, res.data.message]);
          console.log(messages);
        }
      };
    }
    navigate("/");
  };

  const handleStart = () => {
    if (socket) {
      console.log(roomId);
      socket.send(
        JSON.stringify({
          type: "start_game",
          roomId,
        })
      );

    }
  }

  const handleStartDraw = () => {
    if (socket) {
      console.log(roomId);
      socket.send(
        JSON.stringify({
          type: "start_draw",
          room: selectedRoom,
        })
      );
    }
  }

  return (


    <div
      style={{
        background: "#4aa0e2",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Typography
        padding={"5px"}
        fontSize={"30px"}
        color="white"
        fontWeight={"bold"}
      >
        Room: {selectedRoom?.name}
      </Typography>
      {/* group1 */}
      <Box display="flex" bgcolor="#4aa0e2" padding={"0px"}>
        {/* User List */}
        <Box
          width="20%"
          bgcolor="#FFF"
          p={2}
          borderRadius={2}
          mx={2}
          boxShadow={3}
          overflow="hidden"
          maxHeight="44vh"
        >
          <Typography variant="h6" gutterBottom fontSize={"26px"}>
            Users
          </Typography>
          <List sx={{ overflowY: "scroll", maxHeight: "70vh" }}>
            {users.map((user, index) => (
              <ListItem key={index}>
                <Avatar
                  sx={{
                    bgcolor: green[500],
                    height: "70px",
                    width: "70px",
                    marginRight: "5px",
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
                <div sx={{ display: "flex" }}>
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "20px",
                      color: "primary",
                    }}
                    primary={`${user.name}`}
                    secondary={`${user.diem} điểm`}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "18px",
                    }}
                  >
                    Status:
                    <span>
                      {user && user.status === "active"
                        ? " online"
                        : " offline "}
                    </span>
                    <CircleIcon
                      color={user.status === "active" ? "success" : "error"}
                      sx={{ marginLeft: "5px" }}
                    />
                  </Typography>
                </div>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Game Box with Drawing Canvas */}
        <Box
          flexGrow={1}
          bgcolor="#e6f7ff"
          p={4}
          borderRadius={2}
          boxShadow={3}
          mx={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          maxHeight="40vh"

        >
          {/* {console.log("XEM ĐÃ CẬP NHẬT CHƯA", userNotNull)} */}
          {/* {isWait}
            {selectedRoom.status} */}

          {(isWait == true) ?

            (
              // userNotNull == true ?

              // (
              // console.log("Giờ mới được gọi nè",userNotNull)
              // console.log("USER HẾT NULL RÙI: ", user)
              <Waiting
                handleStart={handleStart}
                handleExist={handleExist}
                handleStartDraw={handleStartDraw}
              />
              // ) : null

            )

            : <DrawingCanvas
              handleDraw={handleDraw}
              handleExist={handleExist}
              canvasRef={canvasRef}
            />
          }
          {/* {percentage} */}
          {/* {selectedRoom.status} */}
          {/* time*/}
          <div style={{ width: '100%', height: '10px', backgroundColor: '#ccc' }}>
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                transition: 'width 0.1s',
              }}
            />
          </div>
        </Box>

      </Box>


      {/* group2 */}
      {/* Chat Section Below Drawing Area */}
      <Box display="flex" justifyContent="center" mt={2} px={3}>
        {/* Answer Chat */}
        <Box
          width="50%"
          bgcolor="#FFF"
          p={2}
          borderRadius={2}
          boxShadow={3}
          mr={2}
          display="flex"
          flexDirection="column"

        >
          <Typography variant="h6" gutterBottom>
            Answer Chat
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            height="100%"
            overflowY="auto"
            bgcolor="#f5f5f5"
            p={1}
            mb={2}
            borderRadius={1}
            sx={{
              overflowY: "scroll", // Always show scrollbar when content overflows
              maxHeight: "200px",
            }}
          >
            {answers.map((chat, index) => (
              <Typography
                key={index}
                variant="body2"
                fontSize={"17px"}
                padding={"5px"}
                fontWeight={"500"}
                textAlign={"left"}
              >
                {chat}
              </Typography>
            ))}
          </Box>
          <Divider />

          {(user.canAnswer === true) && 
          (<Box display="flex" mt={2}>
            <TextField
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Nhập tin nhắn để trò chuyện"
              variant="outlined"
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              onClick={handleSendAnswer}
            >
              Gửi
            </Button>
          </Box>)}
        </Box>
        {/* Chat */}
        <Box
          width="50%"
          bgcolor="#FFF"
          p={2}
          borderRadius={2}
          boxShadow={3}
          ml={2}
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6" gutterBottom>
            Chat
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            height="200px"
            overflowY="auto"
            bgcolor="#f5f5f5"
            p={1}
            mb={2}
            borderRadius={1}
            sx={{
              overflowY: "scroll",
              maxHeight: "200px",
            }}
          >
            {messages.map((chat, index) => (
              <div>
                <Typography
                  key={index}
                  variant="body2"
                  fontSize={"17px"}
                  padding={"5px"}
                  fontWeight={"500"}
                  textAlign={"left"}
                >
                  {chat}
                </Typography>
              </div>
            ))}
          </Box>
          <Divider />

          <Box display="flex" mt={2}>
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn để trò chuyện"
              variant="outlined"
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              onClick={handleSendMessage}
            >
              Gửi
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Play;
