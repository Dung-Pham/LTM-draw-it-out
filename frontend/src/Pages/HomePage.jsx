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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircleIcon from "@mui/icons-material/Circle";
const item = {
  img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
  title: "Breakfast",
};

const HomePage = () => {
  const { user, setUser, roomId, setRoomId, rooms, setRooms, setSelectedRoom, selectedRoom} = ChatState();
  const { socket } = useContext(WebSocketContext);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClick = () => {
    navigate("/room");
  };
  const handleClose = () => {
    setOpen(false);
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
              Nick name: {user && user?.name}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                fontSize={"25px"}
                margiRight={"15px"}
                marginLeft={"15px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                Status:
                {user && user.status === "active" ? " online" : " offline "}
                <CircleIcon
                  color={`${user.status === "active" ? "success" : "error"}`}
                />{" "}
              </Typography>
            </div>
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
          >
            <Button onClick={handleClick} variant="contained" size="large">
              <Typography fontSize={"20px"}>CÁC PHÒNG</Typography>
            </Button>

            <React.Fragment>
              <Button
                onClick={handleClickOpen}
                variant="contained"
                size="large"
                color="warning"
              >
                <Typography fontSize={"20px"}>PHÒNG MỚI</Typography>
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                  component: "form",
                  onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const roomName = formJson.name;
                    if (socket) {
                      socket.send(
                        JSON.stringify({
                          type: "create_room",
                          name: roomName,
                          userId: user.userId,
                          status: "OPEN",
                        })
                      );
                      socket.onmessage = (event) => {
                        localStorage.setItem("room", event.data);
                        const res = JSON.parse(event.data);
                        const newRoom = res.room;
                        const newUser = res.user;
                        console.log("NEW USER: ", newUser);
                        console.log("NEW ROOM: ", newRoom);
                        // setUser(newUser);
                        setRoomId(newRoom.roomId);
                        setSelectedRoom(newRoom);
                        setRooms({ ...rooms, [newRoom.roomId]: newRoom });
                        navigate("/play");
                      };
                    }
                    console.log(roomId, rooms);
                    handleClose();
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#3f51b5",
                  }}
                >
                  CREATE ROOM
                </DialogTitle>
                <DialogContent sx={{ padding: "20px 24px" }}>
                  <DialogContentText fontSize="18px" sx={{ color: "#555" }}>
                    Please enter the room's name
                  </DialogContentText>
                  <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="name"
                    label="Room Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiInputLabel-root": { color: "#3f51b5" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#3f51b5" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#3f51b5" },
                        "&:hover fieldset": { borderColor: "#3f51b5" },
                        "&.Mui-focused fieldset": { borderColor: "#3f51b5" },
                      },
                    }}
                  />
                </DialogContent>
                <DialogActions sx={{ padding: "10px 24px" }}>
                  <Button
                    onClick={handleClose}
                    sx={{
                      color: "#f50057",
                      fontWeight: "bold",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "rgba(245, 0, 87, 0.1)" },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#303f9f" },
                    }}
                  >
                    Subscribe
                  </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
