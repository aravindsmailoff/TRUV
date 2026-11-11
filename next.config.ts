import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "*.e2b.app"],
  // The development debug channel depends on WebSockets, which may be unavailable
  // behind preview proxies and can prevent the page from hydrating.
  experimental: { reactDebugChannel: false },
  serverExternalPackages: [
    "@whiskeysockets/baileys",
    "whatsapp-rust-bridge",
    "pino",
    "qrcode",
  ],
};

export default nextConfig;
