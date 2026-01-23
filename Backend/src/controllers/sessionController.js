import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

// Create a new session and initialize Stream Video/Chat
export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const streamUserId = userId.toString(); //

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create session in MongoDB
    const session = await Session.create({ 
      problem, 
      difficulty, 
      host: userId, 
      callId 
    }); //

    // Initialize Stream Video Call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: streamUserId,
        custom: { 
          problem, 
          difficulty, 
          sessionId: session._id.toString() 
        },
      },
    }); //

    // Initialize Stream Messaging Channel
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: streamUserId,
      members: [streamUserId],
    }); //

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Join an existing session with a 2-person restriction
export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const streamUserId = userId.toString();

    // 1. Fetch the session
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // 2. Allow host to rejoin without blocking
    if (session.host.toString() === userId.toString()) {
      return res.status(200).json({ session });
    }

    // 3. STRICT BLOCK: If a participant exists and it's not the current user
    if (session.participant && session.participant.toString() !== userId.toString()) {
      return res.status(409).json({ message: "Session is full (2/2)" });
    }

    // 4. REGISTER IN MONGODB: Save only if the slot is empty
    if (!session.participant) {
      session.participant = userId;
      // CRITICAL: Await the save to ensure DB reflects the participant
      await session.save(); 
      console.log(`✅ Participant registered in DB: ${userId}`);
    }

    // 5. SYNC WITH STREAM: Explicitly add and WATCH the channel
    // This ensures the channel exists and the user has 'ReadChannel' permissions
    const channel = chatClient.channel("messaging", session.callId);
    
    // Using addMembers ensures the user is added to the permanent member list
    await channel.addMembers([streamUserId], { text: `${req.user.name} joined the chat` });
    
    // 6. Return the FULLY POPULATED session
    // This prevents the frontend from having 'null' participant data on the first render
    const updatedSession = await Session.findById(id)
      .populate("host", "name profileImage email")
      .populate("participant", "name profileImage email");

    res.status(200).json({ session: updatedSession });
  } catch (error) {
    console.error("Join Session Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
// Get all currently active sessions
export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email")
      .populate("participant", "name profileImage email")
      .sort({ createdAt: -1 })
      .limit(20); //

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get history of sessions for the logged-in user
export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20); //

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Fetch a single session by ID
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage")
      .populate("participant", "name email profileImage"); //

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// End a session (Host only)
export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // Cleanup Stream resources
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true }); //

    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete(); //

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}