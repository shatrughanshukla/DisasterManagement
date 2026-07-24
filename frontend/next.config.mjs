/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning
  turbopack: {
    root: "C:\\Users\\Shivansh Rana\\Desktop\\DTU Academic\\Codes\\WEBD\\SIH25008\\frontend"
  },
  
  // Set output directory
  distDir: 'dist',
  
  // API rewrites
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
