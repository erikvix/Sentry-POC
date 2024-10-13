import axios from "axios";

const api = axios.create();


api.interceptors.request.use((config) => {  
    config.baseURL = 'https://www.cheapshark.com/api/1.0/';
    config.headers["Content-Type"] = "application/json";
    config.timeout = 3000;
    return config;
  });



export default api;