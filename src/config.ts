export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  clientURL: process.env.CLIENT_URL,
  twitter: {
    clientId: process.env.TWITTER_OAUTH_CLIENT_ID,
    clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  database: {
    uri: process.env.MONGODB_URL,
  },
  tweetUpdateAfter: process.env.NEXT_TWEET_UPDATED || 10, // In days,
  gMapKey: process.env.MAP_API_KEY,
});
