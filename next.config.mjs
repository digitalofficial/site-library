/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Headless Chromium for thumbnail capture must stay unbundled.
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
    // The Chromium binary is loaded at runtime, so file tracing can't see it —
    // without this the /admin function ships without bin/ and capture fails.
    outputFileTracingIncludes: { "/admin": ["./node_modules/@sparticuz/chromium/bin/**"] },
  },
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
};
export default nextConfig;
