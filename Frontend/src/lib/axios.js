import axios from "axios"
const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true,
});
// console.log("AXIOS BASE URL:", import.meta.env.VITE_API_BASE_URL);

export default axiosInstance;   