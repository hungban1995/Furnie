import redis from "../../../configs/redis.connect.js";
export const incr = async (userIp) => {
  return await redis.incr(userIp);
};
export const expire = async (userIp, ttl) => {
  return await redis.expire(userIp, ttl);
};
export const ttl = async (userIp) => {
  return await redis.ttl(userIp);
};
