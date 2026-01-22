import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import authRoutes from "./routes/authRoutes.js";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

/* 🔑 REQUIRED FOR CLERK ON RENDER */
app.set("trust proxy", 1);

/* MIDDLEWARE */
app.use(express.json());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use('/api/auth', authRoutes);

/* ROUTES */
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (_, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log("Server running on port:", ENV.PORT)
    );
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
