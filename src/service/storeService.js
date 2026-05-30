const { Store } = require("../model");
const sequelize = require("../db/seq");

class StoreService {
  async createStore(store) {
    const res = await Store.create(store);
    return res.dataValues;
  }

  async getStoresByUserId(user_id, pageNum = 1, pageSize = 20) {
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await Store.findAndCountAll({
      where: { user_id },
      limit: +pageSize,
      offset: +offset,
      order: [["createdAt", "DESC"]],
    });
    return { total: count, list: rows, pageNum: +pageNum, pageSize: +pageSize };
  }

  async findAllStores(pageNum = 1, pageSize = 20, keyword = "") {
    const offset = (pageNum - 1) * pageSize;
    const { Op } = require("sequelize");
    const whereOpt = {};
    if (keyword) {
      whereOpt[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { address: { [Op.like]: `%${keyword}%` } },
      ];
    }
    const { count, rows } = await Store.findAndCountAll({
      where: whereOpt,
      limit: +pageSize,
      offset: +offset,
      order: [["createdAt", "DESC"]],
    });
    return { total: count, list: rows, pageNum: +pageNum, pageSize: +pageSize };
  }

  async findNearbyStores(longitude, latitude, pageNum = 1, pageSize = 20, keyword = "") {
    const offset = (pageNum - 1) * pageSize;
    const { Op } = require("sequelize");
    const whereOpt = {};
    if (keyword) {
      whereOpt[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { address: { [Op.like]: `%${keyword}%` } },
      ];
    }
    // 使用经纬度计算距离 (Haversine formula 简化版或直接 SQL 函数)
    // 这里的 6371 是地球半径(公里)
    const attributes = {
      include: [
        [
          sequelize.literal(`(
            6371 * acos(
              cos(radians(${latitude})) * cos(radians(latitude)) *
              cos(radians(longitude) - radians(${longitude})) +
              sin(radians(${latitude})) * sin(radians(latitude))
            )
          )`),
          "distance",
        ],
      ],
    };

    const { count, rows } = await Store.findAndCountAll({
      where: whereOpt,
      attributes,
      limit: +pageSize,
      offset: +offset,
      order: sequelize.literal("distance ASC"),
    });

    return { total: count, list: rows, pageNum: +pageNum, pageSize: +pageSize };
  }

  async getStoreById(id) {
    const res = await Store.findOne({
      where: { id },
    });
    return res ? res.dataValues : null;
  }

  async updateStoreById(id, store) {
    const res = await Store.update(store, {
      where: { id },
    });
    return res[0] > 0;
  }

  async deleteStoreById(id) {
    const res = await Store.destroy({
      where: { id },
    });
    return res > 0;
  }
  
  async checkStoreOwnership(id, user_id) {
    const store = await Store.findOne({ where: { id, user_id } });
    return !!store;
  }
}

module.exports = new StoreService();