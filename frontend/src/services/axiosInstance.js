import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
  withCredentials: true, // allows sending cookies (for token)
});

export default axiosInstance;