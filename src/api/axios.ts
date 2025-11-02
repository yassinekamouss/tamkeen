import axios from "axios";
 
const baseURL = "/api";


const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
