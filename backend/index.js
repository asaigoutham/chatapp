const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connect = require("./db/moongose");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const errorURL = require("./middleware/errorURL");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path")


app.use(express.json());
dotenv.config();
connect();


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//---->Deployment

const __dirname1 = path.resolve()
if('production'=='production'){
  
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    
    app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
}
else{
    app.get("/", (req, res) => {
        console.log("API is running");
      });
}

//

app.all("*", errorURL, (req, res) => {
  res.send("wrong url");
});

console.log(process.env.PORT);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`listening ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    /* console.log(userData._id); */
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    /* console.log(room); */
  });

  socket.on("new message", (newmessagerec) => {
    var chat = newmessagerec.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newmessagerec.sender._id) return;

      socket.in(user._id).emit("message recieved", newmessagerec);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("User Diconnected");
    socket.leave(userData._id);
  });
});
