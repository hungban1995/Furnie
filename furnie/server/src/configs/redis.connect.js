import Redis from "ioredis";

const redis = new Redis({
  host: "redis-13260.c292.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 13260,
  password: "CWq4fWLZtj0lGNuqvjH15uOIbUxJqho8",
});
redis.on("connect", () => {
  console.log("connected");
});
redis.on("error", (err) => {
  console.log(err);
});
export default redis;
