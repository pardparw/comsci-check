import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    domains:["192.168.1.24", "app.sa.ac.th"],
    localPatterns: [
      {
        pathname: '/public/icon/**',
        search: '',
      },
    ],
  },
  env: {
    DOMAIN: "app.sa.ac.th",

  },
  async rewrites() {
    return [
      {
        source: "/api/:path",
        destination: "http://app.sa.ac.th:3002/:path",
      },
      
    ];
  },
};


export default nextConfig;
