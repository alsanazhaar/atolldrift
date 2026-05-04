/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 960, 1280, 1440, 1920],
    imageSizes: [80, 110, 200, 400],
  },
  compress: true,
};

module.exports = nextConfig;
