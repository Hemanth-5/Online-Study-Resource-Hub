// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/auth.js";

// Import configs
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import recentActivityRoutes from "./routes/recentActivity.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

// App Config
const app = express();

// Inbuilt Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/resources", resourceRoutes);
app.use("/api/v2/tags", tagRoutes);
app.use("/api/v2/comments", commentRoutes);
app.use("/api/v2/activities", recentActivityRoutes);
app.use("/api/v2/notifications", notificationRoutes);

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error, "MongoDB failed to connect");
  });

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on PORT ${process.env.PORT}`);
// });
