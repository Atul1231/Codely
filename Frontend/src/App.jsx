import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/AuthContext"; // Import your custom hook
import HomePage from "./Pages/HomePage";
import DashboardPage from "./Pages/DashboardPage";
import ProblemsPage from "./Pages/ProblemsPage";
import ProblemPage from "./Pages/ProblemPage";
import SessionPage from "./Pages/SessionPage";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated, loading } = useAuth();

  // Prevents flickering while checking localStorage/verifying the token
  if (loading) return null;

  return (
    <>
      <Routes>
        {/* If NOT authenticated, show Home (Login/Signup). If authenticated, skip to Dashboard */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <HomePage /> : <Navigate to={"/dashboard"} />} 
        />

        {/* Protected Routes: If NOT authenticated, redirect to Home ("/") */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to={"/"} />} 
        />
        <Route 
          path="/problems" 
          element={isAuthenticated ? <ProblemsPage /> : <Navigate to={"/"} />} 
        />
        <Route 
          path="/problem/:id" 
          element={isAuthenticated ? <ProblemPage /> : <Navigate to={"/"} />} 
        />
        <Route 
          path="/session/:id" 
          element={isAuthenticated ? <SessionPage /> : <Navigate to={"/"} />} 
        />
        
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;