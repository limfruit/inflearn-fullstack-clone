import {withSentryConfig} from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  experimental: {
    serverActions: {
      // server actions 에서 기본적으로 제한해놓은 용량이 1mb라서 그걸 초과하면 오류가 날 수 있음
      // 오류나는 것을 방지하기 위해 용량 설정을 해줌
      bodySizeLimit: "300mb", 
    },
  },
  images: {
    remotePatterns: [
      ...(process.env.CLOUDFRONT_DOMAIN // CLOUDFRONT_DOMAIN 이 있으면 기존 설정을 넣어주고, 없을 때는 아무것도 안 넣어줌 -> null 방지
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.CLOUDFRONT_DOMAIN as string,
            },
          ]
        : []),

      // Course seed에 있는 host값
      {
        protocol: "https" as const,
        hostname: "cdn.inflearn.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "seongsil",

  project: "inflearn-clone-web",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});