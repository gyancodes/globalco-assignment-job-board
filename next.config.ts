import type { NextConfig } from "next";

const pdfRuntimeFiles = [
  "./node_modules/@napi-rs/canvas/**/*",
  "./node_modules/@napi-rs/canvas-linux-x64-gnu/**/*",
  "./node_modules/pdf-parse/dist/**/*",
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/ai/extract-text": pdfRuntimeFiles,
  },
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
};

export default nextConfig;
