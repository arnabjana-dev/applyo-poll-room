const envConfig = {
  PORT: String(process.env.PORT) ?? "",
  NODE_ENV: String(process.env.NODE_ENV) ?? "",
  FRONTEND_URL: String(process.env.FRONTEND_URL) ?? "",
  JWT_SECRET: String(process.env.JWT_SECRET) ?? "",
  DATABASE_URL: String(process.env.DATABASE_URL) ?? "",
};
export default envConfig;
