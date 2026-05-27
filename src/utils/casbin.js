const { newEnforcer } = require('casbin');
const { SequelizeAdapter } = require('casbin-sequelize-adapter');
const {
  MYSQL_DB,
  MYSQL_ROOT,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
} = require("../config/config.default");
const path = require('path');

let enforcer = null;

/**
 * 初始化 Casbin Enforcer
 */
const initEnforcer = async () => {
  if (enforcer) return enforcer;

  try {
    // 使用配置参数创建适配器，避免实例不兼容问题
    const adapter = await SequelizeAdapter.newAdapter({
      username: MYSQL_ROOT,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      dialect: 'mysql',
      // 可以在这里添加更多 Sequelize 配置
    });

    const modelPath = path.resolve(__dirname, '../config/rbac_model.conf');
    
    enforcer = await newEnforcer(modelPath, adapter);
    
    // 加载策略
    await enforcer.loadPolicy();
    
    return enforcer;
  } catch (err) {
    console.error('Casbin Init Error:', err);
    throw err;
  }
};

/**
 * 获取 Enforcer 实例
 */
const getEnforcer = async () => {
  if (!enforcer) {
    await initEnforcer();
  }
  return enforcer;
};

module.exports = {
  getEnforcer,
};
