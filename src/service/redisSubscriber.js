const redis = require("redis");
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = require("../config/config.default");
const { updateOrderStatus } = require("./orderService");

const createRedisClient = () => {
  return redis.createClient({
    password: REDIS_PASSWORD,
    socket: {
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT, 10),
      reconnectStrategy(retries) {
        if (retries >= 5) {
          return new Error("停止重试连接");
        }
        return 1000 * Math.min(retries, 5);
      },
    },
  });
};

const subscriber = createRedisClient();

subscriber.on("connect", () => {
  console.log("Redis 订阅者连接成功");
});

subscriber.on("error", (err) => {
  console.error("Redis 订阅者连接错误:", err);
});

// 初始化监听器
const initSubscriber = async () => {
  try {
    // 1. 使用一个独立的发布者/常规客户端来修改 Redis 配置
    const configClient = createRedisClient();
    await configClient.connect();
    // 开启键空间通知: E(keyevent events), x(expired events)
    await configClient.configSet("notify-keyspace-events", "Ex");
    await configClient.quit();
    console.log("Redis 已开启过期事件监听配置 (notify-keyspace-events: Ex)");

    // 2. 连接订阅者客户端
    await subscriber.connect();
    
    // 3. 监听过期事件（db 0）
    await subscriber.subscribe("__keyevent@0__:expired", async (message) => {
      // message 就是过期的 key 的名字
      if (message.startsWith("order_timeout:")) {
        const orderId = message.split(":")[1];
        console.log(`收到订单超时事件: 订单ID ${orderId}`);
        try {
          const { Order } = require("../model/index");
          const order = await Order.findByPk(orderId);
          if (order && order.state === 0) {
            order.state = 4; // 取消状态
            await order.save();
            console.log(`订单 ${orderId} 已自动取消释放`);
          }
        } catch (err) {
          console.error(`处理订单超时事件失败 (订单ID: ${orderId}):`, err);
        }
      }
    });
    console.log("Redis 键过期事件订阅成功");
  } catch (error) {
    console.error("初始化 Redis 订阅失败:", error);
  }
};

module.exports = {
  initSubscriber,
};
