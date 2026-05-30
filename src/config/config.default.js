const dotenv = require("dotenv");
const path = require("path");

// 根据环境变量加载对应的 .env 文件
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// 导出
module.exports = process.env;
