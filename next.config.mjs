/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverActions: true,
  },
  images: {
    domains: ["orxegoaxwcglylrtdqrs.supabase.co"],
  },
};

export default nextConfig;
