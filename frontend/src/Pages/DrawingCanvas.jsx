import React, { useRef, useState, useEffect } from "react";
import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import CanvasDraw from "react-canvas-draw";
import { Circle } from "@mui/icons-material";
import { ChatState } from "../context/chat.provider";

const DrawingCanvas = ({ handleDraw, handleExist, canvasRef}) => {
    const [brushColor, setBrushColor] = useState("#000");
    const [brushSize, setBrushSize] = useState(3);
    const { user, drawing} = ChatState();


    const colorOptions = ["#000", "#f00", "#0f0", "#00f", "#ffa500", "#800080"];

    return (
        <>
            <Typography variant="h5" align="center" color="primary" gutterBottom>
                Vẽ hình
            </Typography>

            {/* Canvas color and brush size selection */}
            <Box display="flex" alignItems="center" mt={2} mb={2}>
                <Box display="flex" alignItems="center" mr={2}>
                    {colorOptions.map((color) => (
                        <IconButton
                            key={color}
                            onClick={() => setBrushColor(color)}
                            sx={{
                                backgroundColor: color,
                                width: 24,
                                height: 24,
                                "&:hover": { opacity: 0.8 },
                                border: brushColor === color ? "2px solid #333" : "none",
                            }}
                        >
                            <Circle sx={{ color: "transparent" }} />
                        </IconButton>
                    ))}
                </Box>
                <Box width={100} ml={2}>
                    <Typography variant="body2">Brush Size</Typography>
                    <Slider
                        value={brushSize}
                        onChange={(e, newValue) => setBrushSize(newValue)}
                        min={1}
                        max={10}
                        sx={{ color: "#333" }}
                    />
                </Box>
            </Box>

            {/* Canvas */}
            <CanvasDraw
                ref={canvasRef}
                brushColor={brushColor}
                brushRadius={brushSize}
                canvasWidth={1050}
                canvasHeight={250}
                disabled={!drawing}
                onChange={handleDraw}
                hideGrid
            />

            {/* Buttons for clearing and downloading the canvas */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => canvasRef.current.clear()}
                    sx={{ mr: 2 }}
                >
                    Xóa hình
                </Button>

                <Button onClick={handleExist} variant="contained" color="error">
                    Exist
                </Button>
            </Box>
        </>
    );
};

export default DrawingCanvas;
