const { createClient } = require('redis');

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        return new Error('Redis max retries reached');
      }
      return Math.min(retries * 500, 2000);
    }
  }
});

redisClient.on('error', (err) => {
  console.warn('⚠️ Redis Client Error (non-fatal):', err.message || err);
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.warn("⚠️ Redis connection failed (running without cache):", err.message);
  }
}

module.exports = {
  redisClient,
  connectRedis
};

