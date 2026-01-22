import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext"; 
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel"; 
import toast from "react-hot-toast";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);
  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  
  // Identifying roles using MongoDB IDs
  const isHost = session?.host?._id === user?.id || session?.host?._id === user?._id;
  const isParticipant = session?.participant?._id === user?.id || session?.participant?._id === user?._id;

  const { call, chatClient, channel, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // Initialize starter code when problem or language changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  // 1. STRICT ACCESS CONTROL & JOIN LOGIC
  useEffect(() => {
  if (!session || !user || loadingSession) return;
  
  // If the DB already knows who we are, we are safe to connect
  if (isHost || isParticipant) return;

  // If the DB says someone else is the participant, kick the user
  if (session.participant) {
    toast.error("This session is full.");
    navigate("/dashboard");
    return;
  }

  // REGISTER IN DB FIRST
  joinSessionMutation.mutate(id, { 
    onSuccess: () => {
      refetch(); // This updates the 'session' object, making 'isParticipant' true
      toast.success("Successfully registered as participant!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
      navigate("/dashboard");
    }
  });
}, [id, session?.participant, user?.id, isHost, isParticipant]);
  // 2. STATUS REDIRECT
  useEffect(() => {
    if (!session || loadingSession) return;
    if (session.status === "completed") navigate("/dashboard");
  }, [session?.status, loadingSession, navigate]);

  // 3. CLEANUP: Leave the call when the component unmounts
  useEffect(() => {
    return () => {
      if (call) {
        console.log("Leaving Stream call...");
        call.leave(); 
      }
    };
  }, [call]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(problemData?.starterCode?.[newLang] || "");
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session for everyone?")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT SIDE: PROBLEM & EDITOR */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  <div className="p-6 bg-base-100 border-b border-base-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem || "Loading Problem..."}
                        </h1>
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "..."} •{" "}
                          <span className="font-bold">
                             {session?.participant ? "2/2" : "1/2"} participants
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`badge badge-lg ${getDifficultyBadgeClass(session?.difficulty)}`}>
                          {session?.difficulty?.toUpperCase() || "EASY"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button onClick={handleEndSession} className="btn btn-error btn-sm gap-2">
                            <LogOutIcon className="w-4 h-4" /> End Session
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4">Description</h2>
                        <p className="text-base-content/90">{problemData.description.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      onRunCode={handleRunCode}
                    />
                  </Panel>
                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />
                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT SIDE: VIDEO & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200">
                {/* Guard rendering to ensure StreamCall has a valid instance */}
                {streamClient && call ? (
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Loader2Icon className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-lg font-medium">Establishing secure connection...</p>
                  </div>
                )}
              </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;