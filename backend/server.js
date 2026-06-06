const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const theatreRoutes = require("./routes/theatreRoutes");
const showRoutes = require("./routes/showRoutes");
const seatRoutes = require("./routes/seatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const seatAutoRelease = require("./utils/seatAutoRelease");

const app = express();

// CREATE SERVER
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// MAKE IO AVAILABLE INSIDE CONTROLLERS
app.set("io", io);

let connectedUsers = 0;

// SOCKET CONNECTION
io.on("connection", (socket) => {
    connectedUsers++;

    socket.userNumber = connectedUsers;

    console.log(`User ${socket.userNumber} connected`);

    // USER JOINS A SHOW ROOM
    socket.on("join-show", (showId) => {
        socket.join(showId);
        console.log(`User ${socket.userNumber} joined room ${showId}`);
    });

    // USER LEAVES A SHOW ROOM
    socket.on("leave-show", (showId) => {
        socket.leave(showId);
        console.log(`User ${socket.userNumber} left room ${showId}`);
    })

    // DISCONNECT
    socket.on("disconnect", () => {
        connectedUsers--;
        console.log(`User ${socket.userNumber} disconnected`);
    });
});

// MIDDLEWARE
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/theatre", theatreRoutes);
app.use("/api/show", showRoutes);
app.use("/api/seat", seatRoutes);
app.use("/api/booking", bookingRoutes);

// MONGO DB
connectDB();

// SEATS AUTO RELEASE
seatAutoRelease(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});