const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET","POST"] }
});

io.on("connection", socket => {
  console.log("Admin connected:", socket.id);
});

app.post("/emit-order", (req,res) => {
  const order = req.body;
  io.emit("newOrder", order);
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Realtime server running on port", PORT);
});
