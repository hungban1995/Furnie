import { incr, expire, ttl } from "../models/limiter.js";
const limitRequest = async (req, res, next) => {
  try {
    const userIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const numRequest = await incr(userIp);
    let _ttl;
    if (numRequest === 1) {
      await expire(userIp, 60);
      _ttl = 60;
    } else {
      _ttl = await ttl(userIp);
    }
    if (numRequest > 100) {
      return next({
        status: 400,
        error: "Server busy",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
export default limitRequest;
