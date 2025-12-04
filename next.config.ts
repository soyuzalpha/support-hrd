import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio.gsa-indonesia.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "minio.gsa-indonesia.com",
        pathname: "/testgsa/**",
      },
      {
        protocol: "http",
        hostname: "testapi.gsa-indonesia.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "testapi.gsa-indonesia.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "coba.transtama.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
