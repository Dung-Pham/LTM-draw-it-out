import React, { useRef, useState } from "react";
import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import { ChatState } from "../context/chat.provider";
import newTurn from "../images/newTurn.jpg";
import keyword from "../images/keyword.jpg";
import waitStart from "../images/waitingPlayer.png";
import answer from "../images/Answer.jpg";
import endGame from "../images/END.png";


const Waiting = ({ handleStart, handleExist, handleStartDraw }) => {
    // await user !== null
    const { user, setUser, drawing, selectedRoom, isWait, setIsWait } = ChatState();

    return (
        // chờ đủ người/ chờ chủ phòng bấm bắt đầu
        <>
            {(selectedRoom.status === "ENABLESTART" || selectedRoom.status === "OPEN") ? (
                <>
                    <Typography variant="h5" align="center" color="primary" gutterBottom>
                        ĐANG CHỜ
                    </Typography>

                    <img
                        width={"50%"}
                        height={"50%"}
                        src={`${waitStart}?w=200&h=150&fit=crop&auto=format`}
                        alt={"waiting"}
                        loading="lazy"
                    />
                    <Box display="flex" justifyContent="center" mt={2} variant="h3">
                        Đang chờ trò chơi bắt đầu
                    </Box>
                    {(selectedRoom.status === "ENABLESTART" && selectedRoom.adminId === user.userId) &&
                        <Button onClick={handleStart} variant="contained" color="error">
                            Bắt Đầu
                        </Button>
                    }

                </>

            ) : selectedRoom.status === "STARTED" ? (
                <>
                    {drawing ? (
                        // DrawWait
                        <>
                            <img
                                width="50%"
                                height="50%"
                                src={`${keyword}?w=200&h=150&fit=crop&auto=format`}
                                alt="keyword"
                                loading="lazy"
                            />

                            <Box display="flex" justifyContent="center" mt={2}>
                                {selectedRoom.keyword}
                            </Box>
                            <Box display="flex" justifyContent="center" mt={2}>
                                Bấm bắt đầu để vẽ
                            </Box>

                            <Button onClick={handleStartDraw} variant="contained" color="error">
                                Bắt Đầu
                            </Button>
                        </>
                    ) : (
                        // UnDrawWait
                        <>
                            <img
                                width="50%"
                                height="50%"
                                src={`${newTurn}?w=200&h=150&fit=crop&auto=format`}
                                alt="New Turn"
                                loading="lazy"
                            />

                            <Box display="flex" justifyContent="center" mt={2}>
                                Đến lượt của {user.name}
                            </Box>
                        </>
                    )}
                </>

            ) : selectedRoom.status === "ANSWER" ?
                (<>
                    <Typography variant="h5" align="center" color="primary" gutterBottom>
                        ĐÁP ÁN
                    </Typography>

                    <img
                        width={"50%"}
                        height={"50%"}
                        src={`${answer}?w=200&h=150&fit=crop&auto=format`}
                        alt={"waiting"}
                        loading="lazy"
                    />
                    <Box display="flex" justifyContent="center" mt={2} variant="h3">
                        Từ khóa là : {selectedRoom.keyword}
                    </Box>

                </>)
                : (
                    <>
                        <Typography variant="h5" align="center" color="primary" gutterBottom>
                            Trò Chơi Kết thúc
                        </Typography>

                        <img
                            width={"50%"}
                            height={"50%"}
                            src={`${endGame}?w=200&h=150&fit=crop&auto=format`}
                            alt={"waiting"}
                            loading="lazy"
                        />
                        <Box display="flex" justifyContent="center" mt={2} variant="h3">
                            Top 3 người điểm cao nhất
                        </Box>
                        {/* Buttons for clearing and downloading the canvas */}
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button onClick={handleExist} variant="contained" color="error">
                                Exist
                            </Button>
                        </Box>
                    </>
                )
            }
        </>
    );
};

export default Waiting;
