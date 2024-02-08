export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  clientURL: process.env.CLIENT_URL,
  twitter: {
    clientId: process.env.TWITTER_OAUTH_CLIENT_ID,
    clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET,
  },
});
