const apiOrigin =
  (process.env.NEXT_PUBLIC_API_ORIGIN || "").replace(/\/$/, "") ||
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api")
    .replace(/\/api\/?$/i, "")
    .replace(/\/$/, "") ||
  "http://localhost:5050";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
