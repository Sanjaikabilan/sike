/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ["orxegoaxwcglylrtdqrs.supabase.co"],
  },
};

export default nextConfig;
