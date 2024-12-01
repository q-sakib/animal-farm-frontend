import type { NextConfig } from "next";
// module.exports = {
//   reactStrictMode: true,
// };

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["anm-api.onrender.com"], // Add your API domain here
    domains: [
      // "anm-api.onrender.com", // Production API server
      "localhost",
    ], // Add your API domain here
  },
};

export default nextConfig;
