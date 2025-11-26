import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // server actions 에서 기본적으로 제한해놓은 용량이 1mb라서 그걸 초과하면 오류가 날 수 있음
      // 오류나는 것을 방지하기 위해 용량 설정을 해줌
      bodySizeLimit: "300mb", 
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CLOUDFRONT_DOMAIN as string,
      },

      // Course seed에 있는 host값
      {
        protocol: "https",
        hostname: "cdn.inflearn.com",
      },
    ],
  },
};

export default nextConfig;
