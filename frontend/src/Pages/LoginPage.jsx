import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  Box,
  MenuItem,
} from "@mui/material";
import anh from "../images/gartic_cover.jpg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import WebSocketContext from "../context/websocket.provider";
import { ChatState } from "../context/chat.provider";
const item = {
  img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
  title: "Breakfast",
};

function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { socket } = useContext(WebSocketContext);
  const [edit, setEdit] = useState(false);
  const { user, setUser } = ChatState();

  const handleClick = () => {
    navigate("/play");
  };
  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        console.log("Received message:", message.data);
      };
    }
  }, [socket]);
  const handleClickUpdateName = () => {
    setEdit(true);
    if (socket) {
      console.log(socket);
      socket.send(
        JSON.stringify({
          type: "create_user",
          username: name,
          isAdmin: false,
          status: "active",
        })
      );
      socket.onmessage = (event) => {
        // setMessage([...message, event.data]);
        localStorage.setItem("user", JSON.stringify(event.data));

        setUser(JSON.parse(event.data));
        navigate("/");
      };
    }
  };
  return (
    <div
      style={{
        background: "#0451F3",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "30px",
            height: "80vh",
            margin: "auto",
          }}
        >
          <Typography padding={"30px"} fontSize={"35px"}>
            Game vẽ nhiều người chơi
          </Typography>
          <img
            width={"80%px"}
            height={"30%"}
            srcSet={`${anh}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${anh}?w=300&h=250&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          />
          <div
            style={{
              marginTop: "50px",
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <AccountCircleIcon fontSize="large" color="primary" />
            <Typography
              fontSize={"25px"}
              marginRight={"15px"}
              marginLeft={"15px"}
            >
              Nick name
            </Typography>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              size="medium"
              disabled={edit}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              onClick={handleClickUpdateName}
              variant="contained"
              size="large"
              color="success"
            >
              <Typography fontSize={"20px"}>LOGIN</Typography>
            </Button>
          </div>
          <div
            style={{
              marginTop: "50px",
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
            }}
          ></div>
        </Box>
      </Container>
    </div>
  );
}

export default LoginPage;
