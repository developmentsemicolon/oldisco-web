import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Garantir que não compile arquivos fora do app/
  pageExtensions: ['tsx', 'ts'],
  // Limpar output
  cleanDistDir: true,
  // Exclude App.tsx from build (not used in App Router)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configuração do Turbopack (necessária quando usando Turbopack por padrão)
  // O CSS do Quill é carregado dinamicamente via link tag, então não precisa ser processado
  turbopack: {},
  // Webpack alias configuration to resolve @/* paths during build
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
  // Configuração de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oldisco.netlify.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-6f79e58d0a634b06aef800e09d2c5055.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Security headers
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/produzir-material',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/produzir-material',
        permanent: true,
      },
      {
        source: '/montar-cd',
        destination: '/produzir-material',
        permanent: true,
      },
      {
        source: '/montar-cd/:path*',
        destination: '/produzir-material',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

export default nextConfig;

