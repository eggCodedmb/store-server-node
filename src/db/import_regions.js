const fs = require("fs");
const path = require("path");
const seq = require("../db/seq");
const Province = require("../model/area/Province");
const City = require("../model/area/City");
const Area = require("../model/area/Area");
const { delKey } = require("../utils/redis");

async function importRegions() {
  const jsonPath = path.join(__dirname, "data_level3.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("未找到 data_level3.json 数据源文件");
    return;
  }

  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(rawData);
  console.log(`读取到 ${data.length} 条地区原始数据`);

  try {
    await seq.authenticate();
    console.log("数据库连接成功");

    // 禁用外键检查，以便重建表
    await seq.query("SET FOREIGN_KEY_CHECKS = 0");

    // 同步表结构（按依赖关系逆序删除，正序创建）
    console.log("开始创建省市区表...");
    await Area.drop();
    await City.drop();
    await Province.drop();

    await Province.sync();
    await City.sync();
    await Area.sync();
    console.log("表结构同步完成");

    const provincesList = [];
    const citiesList = [];
    const citiesParentMap = {}; // 用来根据 cityCode 查找 provinceCode

    // 1. 过滤和分类省、市
    for (const item of data) {
      if (item.deep === "0") {
        provincesList.push({
          code: String(item.id),
          name: item.name,
        });
      } else if (item.deep === "1") {
        citiesList.push({
          code: String(item.id),
          name: item.name,
          provinceCode: String(item.pid),
        });
        citiesParentMap[String(item.id)] = String(item.pid);
      }
    }

    // 2. 过滤和分类区县
    const areasList = [];
    for (const item of data) {
      if (item.deep === "2") {
        const cityCode = String(item.pid);
        const provinceCode = citiesParentMap[cityCode] || null;
        areasList.push({
          code: String(item.id),
          name: item.name,
          cityCode: cityCode,
          provinceCode: provinceCode,
        });
      }
    }

    // 重新开启外键检查
    await seq.query("SET FOREIGN_KEY_CHECKS = 1");

    // 3. 批量插入数据库（保证插入顺序：省 -> 市 -> 区）
    console.log(`正在导入 ${provincesList.length} 个省份...`);
    await Province.bulkCreate(provincesList);

    console.log(`正在导入 ${citiesList.length} 个城市...`);
    await City.bulkCreate(citiesList);

    console.log(`正在导入 ${areasList.length} 个区县...`);
    await Area.bulkCreate(areasList);

    console.log("省市区数据全部导入成功！");

    // 4. 清除 Redis 缓存以防脏数据
    await delKey("regions_all");
    console.log("Redis 缓存 regions_all 已清除。");

  } catch (error) {
    console.error("导入数据时发生错误:", error);
  } finally {
    const { closeClient } = require("../utils/redis");
    closeClient();
    await seq.close();
  }
}

importRegions();
