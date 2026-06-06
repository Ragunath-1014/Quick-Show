import { io } from "socket.io-client";

const socket = io("https://quick-show-1ii5.onrender.com", {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;