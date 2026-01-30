import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import passport from "./config/passport";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import aiRoutes from "./routes/aiRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import medicalRecordRoutes from "./routes/medicalRecordRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import prescriptionRoutes from "./routes/prescriptionRoutes";
import chatRoutes from "./routes/chatRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res
      .status(500)
      .json({
        message: "Something went wrong!",
        error: err.message,
        stack: err.stack,
      });
  },
);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `🤖 AI Assistant: ${
          process.env.GEMINI_API_KEY ? "Enabled" : "Disabled"
        }`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
