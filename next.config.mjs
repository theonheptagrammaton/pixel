/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent middleware from re-encoding rewritten URLs (fixes RSC payload corruption on subdomain rewrites)
  skipMiddlewareUrlNormalize: true,

  // Enable standalone output only in production (dev mode keeps normal output to avoid CSS issues)
  ...(process.env.NODE_ENV === "production" ? { output: "standalone" } : {}),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  async headers() {
    return [
      {
        // Exclude _next/static and _next/image from security headers
        source: "/((?!_next/static|_next/image).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Prevent Cloudflare (and other proxies) from transforming response
          // bodies — specifically to stop Email Obfuscation / Auto Minify from
          // corrupting Next.js RSC streaming payloads embedded in HTML.
          { key: "Cache-Control", value: "no-transform" },
        ],
      },
    ];
  },
};

export default nextConfig;
