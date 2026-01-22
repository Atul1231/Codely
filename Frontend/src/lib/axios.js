import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  // Keep this if you plan to use HTTP-only cookies later, 
  // otherwise it doesn't hurt to keep for CORS consistency.
  withCredentials: true, 
});

// This runs before every request sent to your backend
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attaches the token to the header so protectRoute can see it
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;