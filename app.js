import express from "express";

const app = express();

app.use(express.json());

// const timeRouter = require("./routes/timeRoutes");

// app.use("/api", timeRouter);

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.post("/testpost", (req, res) => {
//   res.status(200).json({
//     message: "POST route works",
//   });
// });

global.tasks = [];
global.users = [];
global.user_id = null;

import authMiddleware from "./middleware/auth.js";
import taskRouter from "./routes/taskRoutes.js";

app.use("/api/tasks", authMiddleware, taskRouter);
import userRouter from "./routes/userRoutes.js";
import notFound from "./middleware/not-found.js";
import errorHandler from"./middleware/error-handler.js";

app.use("/api/users", userRouter);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

export { app, server };
