const redis = require("redis");
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = require("../config/config.default");

let retryCount = 1;
const maxRetries = 5;

const client = redis.createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT, 10),
    reconnectStrategy(retries) {
      retryCount = retries + 1;
      if (retryCount >= maxRetries) {
        console.log("Redis连接失败次数超过5次，自动断开连接");
        return new Error("停止重试连接");
      }
      return 1000 * Math.min(retries, 5000); // 返回重试间隔时间
    },
  },
});

client.on("connect", () => {
  console.log("Redis连接成功");
});

client.on("error", (err) => {
  console.error(`Redis连接错误${retryCount}次`);
});

client.on("end", () => {
  console.log("Redis连接已断开");
});

/**
 *
 * @param {String} key  名称
 * @param {*} data 保存的数据
 * @param {Number} time 设置过期时间单位是秒，默认是null
 */
const setData = async (key, data, time = null) => {
  if (!client.isOpen) await client.connect(); // 确保客户端连接
  data = JSON.stringify(data);
  if (time) {
    await client.set(key, data, { EX: time });
  } else {
    await client.set(key, data);
  }
};

/**
 *
 * @param {String} key
 * @returns
 */
const getData = async (key) => {
  if (!client.isOpen) await client.connect(); // 确保客户端连接
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

const delKey = async (key) => {
  if (!client.isOpen) await client.connect();
  await client.del(key);
};

const delKeyAll = async (key) => {
  try {
    if (!client.isOpen) await client.connect();
    const keys = await client.keys(`${key}*`);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    throw new Error("redis删除失败");
  }
};

const { getBeijingDateStr } = require("./index");

/**
 * 获取自增取餐码，24小时后重置
 * @returns {Promise<Number>}
 */
const getNextPickupCode = async () => {
  if (!client.isOpen) await client.connect();
  
  // 从网络获取准确的日期字符串，确保 00:00 重置
  const dateStr = await getBeijingDateStr();

  const key = `pickup_code_sequence:${dateStr}`;
  const code = await client.incr(key);

  // 设置 25 小时过期，确保当天有效且之后自动清理
  if (code === 1) {
    await client.expire(key, 25 * 60 * 60);
  }

  return code;
};

// 关闭 Redis 客户端
const closeClient = () => {
  client.quit((err) => {
    if (err) console.error("关闭 Redis 客户端失败", err);
    else console.log("Redis 客户端已关闭");
  });
};

// 连接 Redis 数据库封装
const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    throw new Error("连接Redis数据库失败");
  }
};

module.exports = {
  connectRedis,
  setData,
  getData,
  delKey,
  delKeyAll,
  getNextPickupCode,
  closeClient,
};


