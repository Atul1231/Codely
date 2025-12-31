import express from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

/* =========================
   CORS – MUST BE FIRST
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://codely-app.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

// Clerk AFTER CORS
app.use(clerkMiddleware());

/* =========================
   ROUTES
========================= */
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

/* =========================
   SERVER START
========================= */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`🚀 Server running on port ${ENV.PORT}`)
    );
  } catch (error) {
    console.error("💥 Server startup error:", error);
  }
};

startServer();
