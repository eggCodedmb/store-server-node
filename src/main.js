const { app } = require("./app");
const { APP_PORT, UPLOAD_TYPE } = require("./config/config.default");
const { initSubscriber } = require("./service/redisSubscriber");

app.listen(APP_PORT, async () => {
  console.log("上传模式:", UPLOAD_TYPE);
  
  // 初始化 Redis 键空间过期监听
  await initSubscriber();
  
  console.log(`http://127.0.0.1:${APP_PORT}`);
});
