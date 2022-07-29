/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
    domains: [ ],
  },
  env: {
    GATEWAY_BASE_URL: "http://localhost:4000"
  },
  pageExtensions: ["page.tsx"],
};

module.exports = nextConfig;
