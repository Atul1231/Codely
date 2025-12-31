import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}
const axiosInstance = axios.create({
    baseURL:API_URL,
    withCredentials:true,
});
// console.log("AXIOS BASE URL:", import.meta.env.VITE_API_BASE_URL);
console.log(axiosInstance.defaults.baseURL);

export default axiosInstance;   