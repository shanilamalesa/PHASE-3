require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,

  mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY,
  mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET,
  mpesaShortcode: process.env.MPESA_SHORTCODE,
  mpesaPasskey: process.env.MPESA_PASSKEY,
  mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL,

  nodeEnv: process.env.NODE_ENV || "development",
};