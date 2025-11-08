const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '..'),
  webpack: (config, { isServer }) => {
    // Alias legacy package name used by some dependencies
    config.resolve = config.resolve || {};
    config.resolve.extensions = Array.from(new Set([...(config.resolve.extensions || []), '.mjs', '.js', '.json']));
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-three-fiber': '@react-three/fiber',
      // Exact-match SimplexNoise to our shim so it doesn't fall through to three-stdlib
      'three/examples/jsm/math/SimplexNoise$': path.resolve(__dirname, 'src/shims/simplex-noise-shim.js'),
      'three/examples/jsm/math/SimplexNoise.js$': path.resolve(__dirname, 'src/shims/simplex-noise-shim.js'),
      'three/examples/jsm/math/SimplexNoise.mjs$': path.resolve(__dirname, 'src/shims/simplex-noise-shim.js'),
      // Also catch resolutions that have already been mapped to three-stdlib
      'three-stdlib/math/SimplexNoise$': path.resolve(__dirname, 'src/shims/simplex-noise-shim.js'),
      'three-stdlib/math/SimplexNoise.js$': path.resolve(__dirname, 'src/shims/simplex-noise-shim.js'),
      'three-stdlib/math/SimplexNoise.mjs$': path.resolve(__dirname, 'src/shims/simplex-noise-shim.js'),
      // Map legacy three examples imports to three-stdlib package root
      'three/examples/jsm': 'three-stdlib',
      // Route any @react-three/drei root import to a minimal shim that re-exports only what we use
      '@react-three/drei$': path.resolve(__dirname, 'src/shims/drei-shim.js'),
    };
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        ...config.resolve.fallback,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
