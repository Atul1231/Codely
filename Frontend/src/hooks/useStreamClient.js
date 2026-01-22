import { useEffect, useState, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";
function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  const connectingRef = useRef(false);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let isMounted = true;

    const initCall = async () => {
      // MANDATORY GUARD: Do not attempt to connect if the user isn't 
      // registered as host or participant in MongoDB yet.
      if (!session?.callId || loadingSession) return;
      if (!isHost && !isParticipant) {
        setIsInitializingCall(false); // Stop loader if not authorized
        return;
      }
      if (session.status === "completed") return;
      
      if (connectingRef.current) return;
      connectingRef.current = true;
      setIsInitializingCall(true);

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        // Initialize Video
        const client = await initializeStreamClient(
          { id: userId, name: userName, image: userImage },
          token
        );
        if (!isMounted) return;
        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: isHost });
        if (!isMounted) return;
        setCall(videoCall);

        // Initialize Chat
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);
        await chatClientInstance.connectUser(
          { id: userId, name: userName, image: userImage },
          token
        );
        if (!isMounted) return;
        setChatClient(chatClientInstance);

        // SYNC FIX: Watch Channel with Retry
        // This handles the delay while the backend adds the participant to the channel members
        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        let retryCount = 0;
        while (retryCount < 3) {
          try {
            await chatChannel.join();
            if (isMounted) setChannel(chatChannel);
            break; 
          } catch (err) {
            if (err.status === 403) {
              retryCount++;
              await new Promise(r => setTimeout(r, 1000)); 
            } else throw err;
          }
        }
      } catch (error) {
        console.error("Init call failed", error);
        if (isMounted) toast.error("Connection failed. Please refresh.");
      } finally {
        if (isMounted) {
          setIsInitializingCall(false);
          connectingRef.current = false;
        }
      }
    };

    initCall();

    return () => {
      isMounted = false;
      connectingRef.current = false;
      // ... existing cleanup logic
    };
  }, [session?.callId, loadingSession, isHost, isParticipant]); // Added loadingSession to deps

  return { streamClient, call, chatClient, channel, isInitializingCall };
}

export default useStreamClient;