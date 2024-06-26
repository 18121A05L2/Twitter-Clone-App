const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let users = [];

function addUser(address, socketId) {
  !users.some((user) => user.address === address) &&
    users.push({ address, socketId });
  console.log(users);
  console.log("new users : " + address);
}

// function removeUser(socketId) {
//   users = users.filter((user) => user.socketId === socketId);
// }

function getUser(receiverAddress) {
  return users.find((user) => user.address === receiverAddress);
}

io.on("connection", (socket) => {
  // when connects
  console.log(" a user connected ");

  socket.on("addUser", (senderAddress) => {
    addUser(senderAddress, socket.id);
    io.emit("getUsers", users);
  });
  console.log(users);

  // send and get messages
  socket.on("sendMessage", ({ senderAddress, receiverAddress, msg }) => {
    console.log("sender message : " + msg);
    console.log("sender id  : " + senderAddress);
    console.log("receiver id : " + receiverAddress);
    console.log(users);
    const receiver = getUser(receiverAddress);
    console.log("sending message to ");
    console.log(receiver);
    console.log();
    io.emit("getMessage", { senderAddress, msg });
    io.to(receiver?.socketId).emit("getMessage", { senderAddress, msg });
  });

  // when disconnects
  //   socket.on("disconnect", () => {
  //     console.log(" a user was disconnected");
  //     removeUser(socket.Id);
  //     io.emit("getUsers", users);
  //   });
});
