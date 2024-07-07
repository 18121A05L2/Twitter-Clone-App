import axios from "axios";

let liveURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// let pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT_SECRET;
export const localhost = liveURL ? liveURL : "http://localhost:8001";

const axiosAPI = axios.create({
  baseURL: localhost,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
    // get: {
    //   "Content-Type": "application/json",
    //   Authorization: `Bearer ${pinataJwt}`,
    // },
  },
  timeout: 15000,
});
export default axiosAPI;
