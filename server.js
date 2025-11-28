const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// CORS cho mọi domain
app.use(cors());
app.use(express.json());

// Render cấp biến PORT, nếu không có thì chạy local 3000
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Khi có client kết nối
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// API để PHP gọi
app.post("/emit-order", (req, res) => {
    console.log("📦 Nhận đơn hàng mới từ PHP:", req.body);

    io.emit("newOrder", req.body);

    return res.json({ status: "OK", message: "Event emitted" });
});

// Khởi động server
server.listen(PORT, () => {
    console.log("Realtime server running on port", PORT);
});
