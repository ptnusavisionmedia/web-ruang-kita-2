import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Folder keluaran bisa diganti (mis. NEXT_DIST_DIR=.next-build) agar build tidak bentrok dengan dev server.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Header keamanan dasar (berlaku di Netlify maupun Vercel).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
