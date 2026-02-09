import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@whiskeysockets/baileys'],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;