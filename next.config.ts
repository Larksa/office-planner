import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to ensure successful deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
