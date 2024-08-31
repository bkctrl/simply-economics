import withImages from 'next-images';

const nextConfig = withImages({
  distDir: "build",
  productionBrowserSourceMaps: false,
  env: {
    NEXT_PUBLIC_USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
    NEXT_PUBLIC_USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    NEXT_PUBLIC_RDS_USER: process.env.NEXT_PUBLIC_RDS_USER,
    NEXT_PUBLIC_RDS_HOST: process.env.NEXT_PUBLIC_RDS_HOST,
    NEXT_PUBLIC_RDS_DATABASE: process.env.NEXT_PUBLIC_RDS_DATABASE,
    NEXT_PUBLIC_RDS_PASSWORD: process.env.NEXT_PUBLIC_RDS_PASSWORD,
    NEXT_PUBLIC_RDS_PORT: process.env.NEXT_PUBLIC_RDS_PORT,
    NEXT_PUBLIC_RDS_APIURL: process.env.NEXT_PUBLIC_RDS_APIURL,
  },
});

export default nextConfig;
