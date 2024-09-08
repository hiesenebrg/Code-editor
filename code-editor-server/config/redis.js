const Redis = require("ioredis");

 const redisClient = new Redis(
  "rediss://default:Aeo9AAIjcDFmNzU3NjNkNGQyZmY0OWE0YWFhMWIyMzE3MGZlNWE4ZXAxMA@strong-weevil-59965.upstash.io:6379"
);
module.exports =redisClient;
// await client.set('foo', 'bar');