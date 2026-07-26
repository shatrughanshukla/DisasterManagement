/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://readyscout.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;

// import path from "path";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   distDir: "dist",

//   turbopack: {
//     root: path.resolve(__dirname),
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://localhost:5000/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Set output directory
//   distDir: 'dist',

//   // API rewrites
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://localhost:5000/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;
