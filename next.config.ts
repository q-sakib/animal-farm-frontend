import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React strict mode
  images: {
    domains: [
      "animal-farm-backend.onrender.com", // Correct domain without protocol
      "localhost", // For local development
    ],
  },
};

export default nextConfig;
