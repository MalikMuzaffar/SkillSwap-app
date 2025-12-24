// import dotenv from "dotenv";
// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import userRouter from "./Routes/user.routes.js";
// import DbConn from "./db/DbConn.js";// Replace with your actual DB connection file path
// import skillRouter from './Routes/skill.routes.js'
// import categoryRouter from './Routes/category.routes.js'
// import connectionRouter from './Routes/connection.routes.js'
// import chatRouter from './Routes/chat.routes.js'
// import reviewRouter from './Routes/review.routes.js'
// import adminRouter from './Routes/admin.routes.js'
// import reportRouter from './Routes/report.routes.js'
// import notificationRouter from './Routes/notification.routes.js'
// // Load environment variables
// // dotenv.config({ path: "./.env" });

// // const app = express();


// // const allowedOrigins = 'http://18.118.212.240:5173'; // Frontend URL

// // // Middleware
// // app.use(cors({
// //   origin: allowedOrigins,
// //   credentials: true,
// // }));

// // Load environment variables
// dotenv.config({ path: "./.env" });

// const app = express();

// // Use FRONTEND_URL from .env
// const allowedOrigins = process.env.FRONTEND_URL;

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));

// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());
// app.use(express.static("public"));


// // Routes
// app.use('/message', chatRouter)
// app.use("/users", userRouter);
// app.use("/skill", skillRouter);
// app.use('/category',categoryRouter)
// app.use('/connection',connectionRouter)
// app.use('/review',reviewRouter)
// app.use('/admin',adminRouter)
// app.use('/report',reportRouter)
// app.use('/notification',notificationRouter)
// // Global error handler
// // Database connection and server start
// DbConn()
//   .then(() => {
//     app.on("error", () => {
//       console.log("Error is coming in App");
//     });

//     const PORT = process.env.PORT || 8000;
//     app.listen(PORT, () => {
//       console.log(`App is working on port ${PORT}`);
//     });
//   })
//   .catch(() => {
//     console.log("Error in MONGODB Connection");
//   });



/////////////////////////////      NEW  GPT    ///////////////////////////////////////////////////

import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { initSocket } from "./socketServer.js";
import DbConn from "./db/DbConn.js";



// Load env
dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// ROUTES
import userRouter from "./Routes/user.routes.js";
import skillRouter from "./Routes/skill.routes.js";
import categoryRouter from "./Routes/category.routes.js";
import connectionRouter from "./Routes/connection.routes.js";
import chatRouter from "./Routes/chat.routes.js";
import reviewRouter from "./Routes/review.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import reportRouter from "./Routes/report.routes.js";
import notificationRouter from "./Routes/notification.routes.js";
////////////////////////////////////////////////
//       FOR    METRICS     
//import metricsRouter from "./metrics.js";

//import bodyParser from 'body-parser';
import register, {  updateSystemMetrics} from './metrics.js';
////////////////////////////////////////////////

app.use('/message', chatRouter);
app.use("/users", userRouter);
app.use("/skill", skillRouter);
app.use('/category', categoryRouter);
app.use('/connection', connectionRouter);
app.use('/review', reviewRouter);
app.use('/admin', adminRouter);
app.use('/report', reportRouter);
app.use('/notification', notificationRouter);


///////////////////////////////////////////////
//       FOR METRICS
//app.use("/metrics", metricsRouter);
app.get('/metrics', async (req, res) => {
    console.log("In metrics");
  try {
    updateSystemMetrics(); // update CPU & memory before scrape
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics()); // now Prometheus will see updated values
  } catch (err) {
    res.status(500).send('Error collecting metrics');
  }
});

//////////////////////////////////////////////

// Connect to DB
DbConn().then(() => {
  // INIT SOCKET.IO ON SAME SERVER
  initSocket(server);

  const PORT = process.env.PORT || 8000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log("Server + Socket.IO running on:", PORT);
  });
});
