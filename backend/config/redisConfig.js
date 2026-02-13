import { createClient } from 'redis';
const {REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT} = process.env;

export const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export async function connectRedis() {
  await redisClient.connect();
  console.log("Redis connected");
}
