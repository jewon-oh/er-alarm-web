import next_pwa from "next-pwa";

const withPWA = next_pwa({
  dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // reactStrictMode: true,
  register: true,        // 자동 등록
  skipWaiting: true,     // 새 SW가 바로 활성화
  images:{
    domains: ['flagcdn.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

module.exports = withPWA(nextConfig);
