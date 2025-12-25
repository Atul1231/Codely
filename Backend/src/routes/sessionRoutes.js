import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { endSession } from "../controllers/sessionController.js"
import { createSession , getActiveSessions,getMyRecentSessions,joinSession,getSessionById } from "../controllers/sessionController.js"
const router = express.Router()

router.post("/",protectRoute,createSession);
router.get("/active",protectRoute,getActiveSessions);
router.get("/my-recent",protectRoute,getMyRecentSessions);
router.post("/:id/join",protectRoute,joinSession);
router.get("/:id",protectRoute,getSessionById);
router.post(":id/end",protectRoute,endSession);
//api/session/7136129

export default router

