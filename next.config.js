/** @type {import('next').NextConfig} */
const isGitee = process.env.GITEE_DEPLOY === '1';
const nextConfig = {
  reactStrictMode: true,
  ...(isGitee && {
    output: 'export',
    trailingSlash: true,
  }),
};

module.exports = nextConfig;
