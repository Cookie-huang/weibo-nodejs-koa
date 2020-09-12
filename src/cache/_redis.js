/**
 *  @description 连接 redis 的方法 get, set
 */

const redis = require("redis");
const { REDIS_CONF } = require("../conf/db");

//  创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on("error", err => {
  console.error("redis error", err);
});

/**
 * redis set
 * @param {string} key 键
 * @param {string} val 值
 * @param {number} timeout 过期时间 单位 S
 */
function set(key, val, timeout = 60 * 60) {
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }
  redisClient.set(key, val);
  redisClient.expire(key, timeout);
}

function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        return reject(err);
      }
      if (val === null) {
        return resolve(null);
      }

      try {
        resolve(JSON.parse(val));
      } catch (ex) {
        resolve(val);
      }
    });
  });

  return promise;
}

module.exports = {
  set,
  get
};
