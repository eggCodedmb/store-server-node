const seq = require("./seq");

async function main() {
  try {
    console.log("正在检查 orders 表中是否存在 pay_type 字段...");
    const [results] = await seq.query("SHOW COLUMNS FROM `orders` LIKE 'pay_type'");
    if (results.length === 0) {
      console.log("正在向 orders 表中添加 pay_type 字段...");
      // 添加 pay_type 字段，默认值为 1
      await seq.query(
        "ALTER TABLE `orders` ADD COLUMN `pay_type` TINYINT NULL DEFAULT 1 COMMENT '支付方式 (1: 微信支付, 2: 支付宝, 3: 云闪付)' AFTER `state`"
      );
      console.log("pay_type 字段添加成功！");
    } else {
      console.log("pay_type 字段已存在，无需添加。");
    }
    process.exit(0);
  } catch (error) {
    console.error("数据库升级失败:", error);
    process.exit(1);
  }
}

main();
