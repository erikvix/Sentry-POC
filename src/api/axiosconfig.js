import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {  
    config.baseURL = `https://www.omdbapi.com/`;
    config.headers["Content-Type"] = "application/json";
    config.timeout = 3000;
    return config;
  });



export default api;