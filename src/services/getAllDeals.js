import api from "@/api/axiosconfig";

export const getAllDeals = async ( pageNumber = 1) => {
  const response = await api.get(`/deals?pageNumber=${pageNumber}&pageSize=25&storeID=1`);
  console.log(response.data);
  return response.data;
};