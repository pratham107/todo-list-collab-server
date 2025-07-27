// import express from "express";
// import "dotenv/config";
// import cors from "cors"
// import cookieParser from "cookie-parser";
// import { connectDb } from "./config/db.config.js";
// import authRoutes from "./routes/auth.route.js"
// import verifyToken from "./middlewares/verifyJwt.middleware.js";
// import TaskRoutes from "./routes/task.route.js"

// import http from "http";
// import { Server } from "socket.io";





// const app = express();
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow all origins but don't break credentialed requests
//       callback(null, origin || "*");
//     },
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));


// // app.get("/",(req,res)=>{
// //     res.send("Hello World");
// // })

// app.use("/auth",authRoutes);
// app.use('/todo',verifyToken,TaskRoutes)

// app.listen(8000,()=>{
//     connectDb();
//     console.log("server is running on port 8000");
// })

import express from "express";
import "dotenv/config";
import cors from "cors"
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js"
import verifyToken from "./middlewares/verifyJwt.middleware.js";
import TaskRoutes from "./routes/task.route.js"

import http from "http";
import { Server } from "socket.io";





const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://todo-list-collab-client-scwc.vercel.app", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // if you're using cookies/auth headers
  },
});

app.use(
  cors({
    origin: "https://todo-list-collab-client-scwc.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-task", (taskId) => {
    socket.join(taskId);
    console.log(`User ${socket.id} joined task room: ${taskId}`);
  });

  socket.on("new-task", (data) => {
    socket.broadcast.emit("task-added-by-other", data);
  });

  socket.on("task-update",(data)=>{
    socket.broadcast.emit(`Some Update their Task`, data.task);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// app.get("/",(req,res)=>{
//     res.send("Hello World");
// })

app.use("/auth",authRoutes);
app.use('/todo',verifyToken,TaskRoutes);


server.listen(8000, () => {
  connectDb();
  console.log("🚀 Server running on http://localhost:8000");
});