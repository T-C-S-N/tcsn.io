/**
 * @format
 * @type {import('next').NextConfig}
 */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  async redirects() {
    return [
      {
        source: "/from-facebook",
        destination: "/",
        permanent: true,
      },
      {
        source: "/from-linkedin",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
