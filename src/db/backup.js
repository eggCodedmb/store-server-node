const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_ROOT,
  MYSQL_PASSWORD,
  MYSQL_DB,
  MYSQLDUMP_PATH,
  BACKUP_INTERVAL,
} = require("../config/config.default");

/**
 * 执行数据库备份
 */
const backup = () => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const backupDir = path.resolve(__dirname, "../../备份");

    // 确保备份目录存在
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const fileName = `store_${timestamp}.sql`;
    const filePath = path.join(backupDir, fileName);

    // 构建 mysqldump 命令
    // 注意：Windows 路径中可能有空格，需要用引号包裹
    const cmd = `"${MYSQLDUMP_PATH}" -h ${MYSQL_HOST} -P ${MYSQL_PORT} -u ${MYSQL_ROOT} -p${MYSQL_PASSWORD} ${MYSQL_DB} --result-file="${filePath}"`;

    console.log(`[${new Date().toLocaleString()}] 开始备份数据库: ${fileName}...`);

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`备份失败: ${error.message}`);
        return reject(error);
      }
      if (stderr && !stderr.includes("Using a password on the command line interface can be insecure")) {
        console.warn(`备份过程警告: ${stderr}`);
      }
      console.log(`[${new Date().toLocaleString()}] 备份成功: ${filePath}`);
      resolve(filePath);
    });
  });
};

/**
 * 启动定时备份任务
 * 间隔时间通过 .env 中的 BACKUP_INTERVAL 配置（单位：分钟，默认 3）
 */
const startBackupSchedule = () => {
  const intervalMinutes = parseInt(BACKUP_INTERVAL) || 3;
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`已启动定时备份任务，间隔: ${intervalMinutes} 分钟`);

  // 立即运行一次
  backup().catch(() => {});

  setInterval(() => {
    backup().catch(() => {});
  }, intervalMs);
};

// 如果直接运行此脚本
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--schedule")) {
    startBackupSchedule();
  } else {
    // 只运行一次
    backup()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { backup, startBackupSchedule };
