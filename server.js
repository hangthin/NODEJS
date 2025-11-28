
// server.js - Server Realtime thông báo đơn hàng mới
// Chức năng: Nhận dữ liệu từ PHP và phát realtime bằng Socket.IO
const express = require("express");   // Framework web để tạo API nhanh
const http = require("http");         // Tạo HTTP server cho Express & Socket.IO
const cors = require("cors");         // Cho phép truy cập từ domain khác (Cross-Origin)
const { Server } = require("socket.io"); // Thư viện Socket.IO

// ========================
// 1. KHỞI TẠO EXPRESS
// ========================
const app = express();

// Cho phép tất cả domain truy cập (quan trọng cho PHP + Admin Dashboard)
app.use(cors({ origin: "*" }));

// Cho phép Express đọc JSON mà PHP gửi bằng POST
app.use(express.json());

// ========================
// 2. TẠO HTTP SERVER
// ========================
const server = http.createServer(app);

// ========================
// 3. SOCKET.IO SERVER
// ========================
const io = new Server(server, {
    cors: {
        origin: "*",              // Cho phép tất cả domain kết nối socket
        methods: ["GET", "POST"]  // Cho phép các phương thức này
    }
});

// ========================
// 4. LẮNG NGHE KẾT NỐI SOCKET
// ========================
// Kích hoạt mỗi khi có admin mở trang quản trị
io.on("connection", (socket) => {
    console.log(">> Admin connected:", socket.id);
});

// ========================
// 5. API NHẬN DỮ LIỆU TỪ PHP
// ========================
// PHP gọi POST http://localhost:3000/emit-order
app.post("/emit-order", (req, res) => {

    // Chuẩn hóa object đơn hàng
    const order = {
        id: req.body.id,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        total: req.body.total,
        created: req.body.created
    };

    console.log(">> Nhận đơn mới từ PHP:", order);

    // ===== PHÁT REALTIME CHO TẤT CẢ ADMIN =====
    io.emit("newOrder", order);

    // Trả phản hồi lại cho PHP
    res.json({ status: "OK" });
});

// ========================
// 6. KHỞI CHẠY SERVER NODE
// ========================
server.listen(3000, () => {
    console.log(">> Realtime server chạy tại http://localhost:3000");
});
