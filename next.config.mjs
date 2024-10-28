/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // config.module.rules.push({
    //   test: /\.wasm$/,
    //   type: "asset/resource",
    // });

    return config;
  },
};

export default nextConfig;
