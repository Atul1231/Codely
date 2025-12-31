import axios from "axios"
const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
});
console.log("AXIOS BASE URL:", axiosInstance.defaults.baseURL);

export default axiosInstance;