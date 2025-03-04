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
        source: "/api/catalogy/all",
        destination: "http://app.sa.ac.th:3002/catalogy/all",
      },
      {
        source: "/api/item/all",
        destination: "http://app.sa.ac.th:3002/item/all",
      },
      
      {
        source: "/api/borrow/check",
        destination: "http://app.sa.ac.th:3002/borrow/check",
      },
      {
        source: "/api/borrow/all",
        destination: "http://app.sa.ac.th:3002/borrow/all",
      },
      {
        source: "/api/catalogy/catalogy",
        destination: "http://app.sa.ac.th:3002/catalogy/catalogy",
      },
      {
        source: "/api/item/item",
        destination: "http://app.sa.ac.th:3002/item/item",
      },
      {
        source: "/api/item/add",
        destination: "http://app.sa.ac.th:3002/item/add",
      },
      {
        source: "/api/user/login",
        destination: "http://app.sa.ac.th:3002/user/login",
      },
      {
        source: "/api/item/update",
        destination: "http://app.sa.ac.th:3002/item/update",
      },
      {
        source: "/api/catalogy/update",
        destination: "http://app.sa.ac.th:3002/catalogy/update",
      },
      {
        source: "/api/borrow/return",
        destination: "http://app.sa.ac.th:3002/borrow/return",
      },
      {
        source: "/api/borrow/returncheck",
        destination: "http://app.sa.ac.th:3002/borrow/returncheck",
      },
     
      {
        source: "/api/catalogy/add",
        destination: "http://app.sa.ac.th:3002/catalogy/add",
      },
      
      {
        source: "/api/borrow/add",
        destination: "http://app.sa.ac.th:3002/borrow/add",
      },
      {
        source: "/api/catalogy/delete",
        destination: "http://app.sa.ac.th:3002/catalogy/addeleted",
      },
      
      {
        source: "/api/item/delete",
        destination: "http://app.sa.ac.th:3002/item/delete",
      },
      {
        source: "/api/upload",
        destination: "http://app.sa.ac.th:3002/upload",
      },
      
    ];
  },
};


export default nextConfig;
