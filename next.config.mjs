/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan Strict Mode untuk mencegah error "state mismatch" saat login Google
  reactStrictMode: false, 

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig