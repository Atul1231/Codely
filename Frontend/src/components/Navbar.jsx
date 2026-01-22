import { Link, useLocation, useNavigate } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SquareTerminal, LogOutIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Updated: Using your custom JWT Auth
import ThemeToggle from "./ThemeToggle.jsx";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Updated: Pulling user data and logout function from AuthContext
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg ">
            <SquareTerminal className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Codely
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-1">
          <ThemeToggle />
          
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBOARD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          {/* CUSTOM USER DROPDOWN (Replaced UserButton) */}
          <div className="dropdown dropdown-end ml-4">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-primary/20">
              <div className="size-10 rounded-full bg-base-300 flex items-center justify-center">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <UserIcon className="size-6 opacity-50" />
                )}
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-primary/10">
              <li className="menu-title px-4 py-2 border-b border-base-content/5 mb-1">
                <span className="text-xs font-bold uppercase opacity-50">Account</span>
                <p className="text-sm font-medium text-base-content truncate">{user?.name || "User"}</p>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10 flex items-center justify-between"
                >
                  Logout
                  <LogOutIcon className="size-4" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;