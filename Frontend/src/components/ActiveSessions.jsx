import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SquareTerminal,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

/**
 * ActiveSessions Component
 * * @param {Array} sessions - List of active session objects from MongoDB
 * @param {Boolean} isLoading - Loading state from the useSessions hook
 * @param {Function} isUserInSession - Helper to check if current user is host/participant
 * @param {Function} isSessionFull - Helper to check if participant slot is filled
 */
function ActiveSessions({ sessions, isLoading, isUserInSession, isSessionFull }) {
  return (
    <div className="lg:col-span-2 card bg-base-100 border-2 border-primary/20 hover:border-primary/30 h-full">
      <div className="card-body">
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
              <ZapIcon className="size-5 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full">
            <div className="size-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-bold text-success">
              {sessions?.length || 0} active
            </span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <LoaderIcon className="size-10 animate-spin text-primary" />
              <p className="text-sm font-medium opacity-50">Syncing with server...</p>
            </div>
          ) : sessions && sessions.length > 0 ? (
            sessions.map((session) => {
              // Core Logic: Determine if the UI should lock the room
              const full = isSessionFull(session);
              const alreadyIn = isUserInSession(session);
              const cannotJoin = full && !alreadyIn;

              return (
                <div
                  key={session._id}
                  className={`card bg-base-200 border-2 transition-all duration-200 ${
                    cannotJoin 
                      ? "opacity-75 border-transparent grayscale-[0.5] cursor-not-allowed" 
                      : "border-base-300 hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 p-5">
                    {/* LEFT SIDE: ICON & INFO */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative size-14 shrink-0 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-inner">
                        <Code2Icon className="size-7 text-white" />
                        {!cannotJoin && (
                          <div className="absolute -top-1 -right-1 size-4 bg-success rounded-full border-2 border-base-100" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-lg truncate text-base-content">
                            {session.problem}
                          </h3>
                          <span
                            className={`badge badge-sm font-bold ${getDifficultyBadgeClass(
                              session.difficulty
                            )}`}
                          >
                            {session.difficulty?.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm opacity-80">
                          <div className="flex items-center gap-1.5">
                            <CrownIcon className="size-4 text-warning" />
                            <span className="font-medium truncate max-w-[100px]">
                              {session.host?.name || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <UsersIcon className="size-4 text-primary" />
                            <span className="font-bold text-xs">
                              {session.participant ? "2/2" : "1/2"}
                            </span>
                          </div>
                          {cannotJoin ? (
                            <span className="badge badge-error badge-xs font-bold text-[10px] px-2">FULL</span>
                          ) : (
                            <span className="badge badge-success badge-xs font-bold text-[10px] px-2">OPEN</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="shrink-0">
                      {cannotJoin ? (
                        <button className="btn btn-disabled btn-sm px-6 no-animation">
                          Full
                        </button>
                      ) : (
                        <Link 
                          to={`/session/${session._id}`} 
                          className={`btn btn-sm gap-2 px-6 shadow-sm transition-transform active:scale-95 ${
                            alreadyIn ? "btn-secondary" : "btn-primary"
                          }`}
                        >
                          {alreadyIn ? "Rejoin" : "Join"}
                          <ArrowRightIcon className="size-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-base-200/50 rounded-2xl border-2 border-dashed border-base-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center">
                <SquareTerminal className="w-10 h-10 text-primary/30" />
              </div>
              <p className="text-lg font-bold opacity-70 mb-1">No live coding sessions</p>
              <p className="text-sm opacity-50">Start a new session to invite others!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveSessions;