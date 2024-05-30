import axios from "axios";

let liveURL;
// = "https://twitter-zlij.onrender.com";
const localhost = "http://localhost:8001";

const axiosAPI = axios.create({
  baseURL: liveURL ? liveURL : localhost,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },     
});
export default axiosAPI;
