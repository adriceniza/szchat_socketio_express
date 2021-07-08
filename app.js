const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

let messages = [];
let users = [];

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.status(200).send("Server running...");
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("messages", messages);

  socket.on("delUser", (name) => {
    let i = users.indexOf(name);
    users.splice(i, 1);
    io.sockets.emit("userslist", users);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    io.sockets.emit("disconnected");
  });

  socket.on("new-message", (data) => {
    messages.push(data);
    io.sockets.emit("messages", messages);
  });
  socket.on("current_user_name", (data) => {
    users.push(data);
    io.sockets.emit("userslist", users);
  });
});

server.listen(3000, () => {});
