import type { NextConfig } from "next";

// `basePath` is inlined into the client bundle at build time, so it has to be
// chosen per deploy target instead of inferred from NODE_ENV:
//   - Netlify / custom domain -> served from the domain root, no prefix
//   - GitHub Pages            -> served from /elite-health-club
// Set NEXT_PUBLIC_BASE_PATH at build time to opt into a sub-path deploy.
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const basePath =
  rawBasePath === "" || rawBasePath === "/"
    ? ""
    : `/${rawBasePath.replace(/^\/+/, "").replace(/\/+$/, "")}`;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
