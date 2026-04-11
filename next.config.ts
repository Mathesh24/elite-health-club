// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "picsum.photos",
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "your-repo-name"; // exact GitHub repo name

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
