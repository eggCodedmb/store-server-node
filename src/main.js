const { app } = require("./app");
const { APP_PORT, UPLOAD_TYPE } = require("./config/config.default");
const { initSubscriber } = require("./service/redisSubscriber");

app.listen(APP_PORT, async () => {
  await initSubscriber();
  console.info("上传模式:", UPLOAD_TYPE);
  console.info(`服务启动端口：${APP_PORT}`);
});
