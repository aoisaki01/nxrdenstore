/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Ensure we are not using experimental turbopack if it causes issues, or just force restart
  poweredByHeader: false,
};

export default nextConfig;
