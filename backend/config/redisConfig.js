// redis configuration
const redis = require('redis');
const {REDIS_URL,REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB,REDIS_USE_CACHE, REDIS_MAX_CACHE, REDIS_USERNAME } = process.env;

const redisClient = redis.createClient({
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

module.exports = {redisClient}