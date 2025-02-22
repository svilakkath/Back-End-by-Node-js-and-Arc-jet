import cookieParser from "cookie-parser";
import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import erroMiddleWare from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscriptions.routes.js";
import userRouter from "./routes/user.routes.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

app.use(erroMiddleWare);

app.listen(PORT, async () => {
  console.log(`subscription  tracker api is running on port ${PORT}`);
  await connectToDatabase();
});
