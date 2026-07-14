const { Banner } = require("../model/index");
const seq = require("./seq");

async function main() {
  try {
    console.log("正在同步 Banner 模型 (创建 banners 表)...");
    await seq.query("SET FOREIGN_KEY_CHECKS = 0");
    await Banner.sync({ alter: true });
    await seq.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Banner 表同步成功！");
    process.exit(0);
  } catch (error) {
    console.error("同步 Banner 表失败:", error);
    process.exit(1);
  }
}

main();
