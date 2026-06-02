const sequelize = require('./src/db/seq');
const { QueryTypes } = require('sequelize');

async function migrate() {
  try {
    console.log('开始同步规格系统新字段...');

    // 1. 为 spec_group 表添加字段
    const groupColumns = await sequelize.query("SHOW COLUMNS FROM `spec_group`", { type: QueryTypes.SELECT });
    const hasSelectType = groupColumns.some(col => col.Field === 'select_type');
    const hasIsRequired = groupColumns.some(col => col.Field === 'is_required');

    if (!hasSelectType) {
      await sequelize.query("ALTER TABLE `spec_group` ADD COLUMN `select_type` ENUM('single', 'multiple') DEFAULT 'single' COMMENT '选择模式: single-单选, multiple-多选'");
      console.log('- 已添加 spec_group.select_type');
    }

    if (!hasIsRequired) {
      await sequelize.query("ALTER TABLE `spec_group` ADD COLUMN `is_required` TINYINT(1) DEFAULT 1 COMMENT '是否必选: 0-否, 1-是'");
      console.log('- 已添加 spec_group.is_required');
    }

    // 2. 为 spec_option 表添加字段
    const optionColumns = await sequelize.query("SHOW COLUMNS FROM `spec_option`", { type: QueryTypes.SELECT });
    const hasIsDefault = optionColumns.some(col => col.Field === 'is_default');

    if (!hasIsDefault) {
      await sequelize.query("ALTER TABLE `spec_option` ADD COLUMN `is_default` TINYINT(1) DEFAULT 0 COMMENT '是否默认选中: 0-否, 1-是'");
      console.log('- 已添加 spec_option.is_default');
    }

    console.log('数据库字段同步完成！');
    process.exit(0);
  } catch (error) {
    console.error('迁移失败:', error);
    process.exit(1);
  }
}

migrate();
