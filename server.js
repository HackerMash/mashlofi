const { Server } = require("socket.io");

let io;

module.exports = (req, res) => {
  if (!io) {
    const httpServer = require("http").createServer();
    io = new Server(httpServer, {
      cors: {
        origin: "*"
      }
    });

    io.on("connection", (socket) => {
      let currentRoom = null;
      let username = null;

      socket.on("joinRoom", ({ username: name, room }) => {
        if (currentRoom) socket.leave(currentRoom);
        username = name;
        currentRoom = room;
        socket.join(room);
        socket.to(room).emit("message", {
          username: "System",
          text: `${username} has joined ${room}`,
        });
      });

      socket.on("chatMessage", (msg) => {
        if (currentRoom && username) {
          io.to(currentRoom).emit("message", {
            username,
            text: msg,
          });
        }
      });

      socket.on("disconnect", () => {
        if (currentRoom && username) {
          socket.to(currentRoom).emit("message", {
            username: "System",
            text: `${username} has left ${currentRoom}`,
          });
        }
      });
    });

    httpServer.listen(3001);
  }

  res.end("Socket server is running.");
};
