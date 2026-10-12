import { io } from "socket.io-client";

const socket = io("https://quick-show-production.up.railway.app", {
    withCredentials: true,
    transports: ["websocket"]
});

export default socket;