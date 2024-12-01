import {
  Box,
  Button,
  Container,
  Divider,
  styled,
  Typography,
  Paper,
  InputBase,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import WebSocketContext from "../context/websocket.provider";
import { ChatState } from "../context/chat.provider";
import { useNavigate } from "react-router-dom";

const Item = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  border: "1px solid",
  borderColor: "#ced7e0",
  padding: theme.spacing(1),
  borderRadius: "4px",
  textAlign: "center",
  cursor: "pointer",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const Room = () => {
  const { socket } = useContext(WebSocketContext);
  const {
    fullRooms,
    setFullRooms,
    user,
    selectedRoom,
    setSelectedRoom,
    setRooms,
    rooms,
    setRoomId,
    messages,
    setMessages,
    isWait,
    setIsWait,
    setUser
  } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "room_list",
        })
      );
      socket.onmessage = (message) => {
        const { data, type } = JSON.parse(message.data);
        if (type === "room_list") {
          setFullRooms(data);
        }
      };
    }
  }, [socket, setFullRooms]);

  const handleClick = (roomId) => {
    console.log("HÀM ĐÃ ĐƯỢC GỌI NHÉ")
    setRoomId(roomId);
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId,
          userId: user.userId,
        })
      );
      socket.onmessage = (event) => {
        const res = JSON.parse(event.data);
        const { data, type } = res;
        // console.log("ĐÂY LÀ RES ", res.data)
        if (type === "every_one" && res.data.type === "new_join") {
          setMessages([...messages, res.data.message]);
          console.log(res.data.message)
        }
        if (type === "join_room") {
          setSelectedRoom(res.data.room);
          setUser(res.data.user);
          console.log("ĐÂY LÀ USER VÔ PHÒNG: ", res.data.user)
          setRooms({ ...rooms, [data.roomId]: data });
          console.log("ROOM HIỆN TẠI NHƯ THẾ NÀO", res.data.room)
          setIsWait(!res.data.isDraw)
          navigate("/play");
        }

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
        justifyContent: "center",
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ padding: "30px" }}>
            <Typography fontSize="35px">CÁC PHÒNG</Typography>
            <Paper
              component="form"
              sx={{
                p: "10px",
                display: "flex",
                alignItems: "center",
                width: 400,
                marginTop: "10px",
                boxShadow: 1,
                border: 1,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: 20 }}
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>

          <Divider />

          <Box sx={{ flexGrow: 1, margin: 3, overflowY: "auto" }}>
            <Grid container spacing={2}>
              {fullRooms?.length > 0 ? (
                fullRooms.map((room) => (
                  <Grid item xs={4} key={room.roomId}>
                    <Item onClick={() => handleClick(room.roomId)}>
                      <Typography fontSize="20px" paddingTop="15px">
                        Room's name: {room.name}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="25px"
                          gap="5px"
                        >
                          <GroupIcon fontSize="large" />
                          {room.users.length} online
                        </Typography>
                      </Box>
                    </Item>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" textAlign="center" width="100%">
                  No rooms available
                </Typography>
              )}
            </Grid>
          </Box>

          <Divider />

          <Box
            sx={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              paddingBottom: "20px",
            }}
          >
            <Button disabled variant="contained" size="large">
              <Typography fontSize="20px">PLAY</Typography>
            </Button>
            <Button variant="contained" size="large" color="warning">
              <Typography fontSize="20px">NEW ROOM</Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Room;
