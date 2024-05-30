const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let users = [];    

function addUser(userId, socketId) {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log(users);
  console.log("new users : " + userId);
}

// function removeUser(socketId) {
//   users = users.filter((user) => user.socketId === socketId);
// }

function getUser(receiverId) {
  return users.find((user) => user.userId === receiverId);
}

io.on("connection", (socket) => {
  // when connects
  console.log(" a user connected ");

  socket.on("addUser", (senderId) => {
    addUser(senderId, socket.id);
    io.emit("getUsers", users);
  });
  console.log(users);

  // send and get messages
  socket.on("sendMessage", ({ senderId, receiverId, msg }) => {
    console.log("sender message : " + msg);
    console.log("sender id  : " + senderId);
    console.log("receiver id : " + receiverId);
    console.log(users);
    const receiver = getUser(receiverId);
    console.log("sending message to ");
    console.log(receiver);
    console.log();
    io.emit("getMessage", { senderId, msg });
    io.to(receiver?.socketId).emit("getMessage", { senderId, msg });
  });

  // when disconnects
  //   socket.on("disconnect", () => {
  //     console.log(" a user was disconnected");
  //     removeUser(socket.Id);
  //     io.emit("getUsers", users);
  //   });
});
