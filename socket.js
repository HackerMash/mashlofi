const socket = io();

// Join room
function joinRoom(room) {
  socket.emit("joinRoom", { username, room });
}

// Receive messages
socket.on("message", (data) => {
  document.getElementById("messages").innerHTML += `<p><strong>${data.username}</strong>: ${data.text}</p>`;
});

// Send message
function sendMessage() {
  const msg = document.getElementById("messageInput").value;
  socket.emit("chatMessage", msg);
}
