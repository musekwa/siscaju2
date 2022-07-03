import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
  jwtSecret: process.env.JWT_SECRET,
  mongoURI: process.env.MONGODB_URI,
  email_login: process.env.EMAIL_LOGIN,
  email_password: process.env.EMAIL_PASSWORD,
  gmail_key: process.env.GMAIL_KEY,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
  refresh_token: process.env.REFRESH_TOKEN,
};

export default config;
