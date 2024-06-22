import axios from "axios";

let liveURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const localhost = liveURL ? liveURL : "http://localhost:8001";

const axiosAPI = axios.create({
  baseURL: localhost,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
  timeout: 15000,
});
export default axiosAPI;
