import api from "@/api/axiosconfig";
const {VITE_API_KEY} = import.meta.env;


export const getMovie = async (movie) => {
  const response = await api.get(`?apikey=${VITE_API_KEY}&t=${movie}`);
  return response.data;
};