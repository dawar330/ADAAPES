/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   compiler: {
//     styledComponents: true,
//   },
//   swcMinify: true,
// };

//module.exports = nextConfig;
module.exports = {
  env: {
    NEXT_APP_HOST: process.env.NEXT_APP_HOST,
    secret: process.env.SECRET,
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  swcMinify: true,
  images: {
    domains: ["ipfs.io", "ipfs.infura.io"],
  },

  webpack: function (config, options) {
    console.log(options.webpack.version); // 5.18.0
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  },
  serverRuntimeConfig: {
    secret: "SECRET STRING",
  },
};
