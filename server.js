import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import "./config/dbConnect.config.js";
import userRouter from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import groupRoute from "./routes/group.route.js";
import restaurantRoute from "./routes/restaurant.route.js";
import menuRoute from "./routes/menu.route.js";
import groupMemberRoute from "./routes/groupMember.route.js";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import { Gaurd } from "./middlewares/Auth.js";
import { startTask } from "./utils/schedular.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Content-Type
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
startTask();

app.use("/users", Gaurd.Auth, userRouter);
app.use("/orders", Gaurd.Auth, orderRoute);
app.use("/groups", Gaurd.Auth, groupRoute);
app.use("/groupMembers", Gaurd.Auth, groupMemberRoute);
app.use("/restaurants", Gaurd.Auth, restaurantRoute);
app.use("/menus", Gaurd.Auth, menuRoute);
app.use("/admin", adminRoute);
app.use("/auth", authRoute);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText,
    error: {
      statusCode: err.statusCode,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});
