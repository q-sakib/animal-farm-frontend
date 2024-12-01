// src/utils/axiosClient.ts
export const imageUrl = process.env.IMG_ADDRESS;
import axios from "axios";

// Create an Axios instance with a base URL from the environment variable
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Get the base URL from the environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;


