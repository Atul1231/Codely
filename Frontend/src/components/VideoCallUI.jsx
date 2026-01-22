import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

// SDK Styles
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";


function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center bg-base-200">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Joining Secure Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video overflow-hidden">
      {/* MAIN VIDEO AREA */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Info Bar */}
        <div className="flex items-center justify-between bg-base-100 p-3 rounded-xl shadow-sm border border-base-300">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">
              {participantCount}/2 participants
            </span>
          </div>
          
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-sm btn-ghost gap-2 ${isChatOpen ? "text-primary bg-primary/10" : ""}`}
            >
              <MessageSquareIcon className="size-4" />
              {isChatOpen ? "Hide Chat" : "Show Chat"}
            </button>
          )}
        </div>

        {/* Video Layout */}
        <div className="flex-1 bg-neutral rounded-xl overflow-hidden relative shadow-inner border border-base-300">
          <SpeakerLayout />
        </div>

        {/* Controls */}
        <div className="bg-base-100 p-4 rounded-xl shadow-md flex justify-center border border-base-300">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* SIDEBAR CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-xl shadow-xl overflow-hidden bg-base-100 border border-base-300 transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-10 invisible"
          }`}
        >
          <div className="bg-base-200 p-4 border-b border-base-300 flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider">Live Chat</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="btn btn-ghost btn-xs btn-circle"
            >
              <XIcon className="size-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden stream-chat-dark">
            <Chat client={chatClient} theme="str-chat__theme-dark">
              <Channel channel={channel}>
                <Window>
                  <MessageList hideDeletedMessages />
                  <MessageInput grow />
                </Window>
                <Thread />
              </Channel>
            </Chat>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;