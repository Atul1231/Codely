import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { endSession } from "../controllers/sessionController.js"
import { createSession , getActiveSessions,getMyRecentSessions,joinSession,getSessionById } from "../controllers/sessionController.js"
const router = express.Router()

router.post("/",createSession);
router.get("/active",getActiveSessions);
router.get("/my-recent",getMyRecentSessions);
router.post("/:id/join",joinSession);
router.get("/:id",getSessionById);
router.post("/:id/end",endSession);
//api/session/7136129

export default router

