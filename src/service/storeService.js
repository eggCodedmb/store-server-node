const { Store, StorePhoto, Goods } = require("../model");
const sequelize = require("../db/seq");
const { Op } = require("sequelize");

class StoreService {
  async createStore(storeData, photos = []) {
    const transaction = await sequelize.transaction();
    try {
      const store = await Store.create(storeData, { transaction });

      if (photos.length > 0) {
        const photoRecords = photos.map((url, index) => ({
          store_id: store.id,
          url,
          sort_order: index,
        }));
        await StorePhoto.bulkCreate(photoRecords, { transaction });
      }

      await transaction.commit();
      return store.dataValues;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getStoresByUserId(user_id, pageNum = 1, pageSize = 20, keyword = "", filters = {}) {
    const offset = (pageNum - 1) * pageSize;
    const whereOpt = { user_id };

    if (keyword) {
      whereOpt[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { address: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (filters.status !== undefined && filters.status !== "") {
      whereOpt.status = +filters.status;
    }

    const { count, rows } = await Store.findAndCountAll({
      where: whereOpt,
      include: [{ model: StorePhoto, as: "photos", attributes: ["id", "url", "sort_order"] }],
      limit: +pageSize,
      offset: +offset,
      order: [["createdAt", "DESC"]],
    });
    return { total: count, list: rows, pageNum: +pageNum, pageSize: +pageSize };
  }

  async findAllStores(pageNum = 1, pageSize = 20, keyword = "", filters = {}) {
    const offset = (pageNum - 1) * pageSize;
    const whereOpt = {};

    if (keyword) {
      whereOpt[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { address: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (filters.status !== undefined && filters.status !== "") {
      whereOpt.status = +filters.status;
    }
    if (filters.province) {
      whereOpt.province = filters.province;
    }
    if (filters.city) {
      whereOpt.city = filters.city;
    }

    const { count, rows } = await Store.findAndCountAll({
      where: whereOpt,
      include: [{ model: StorePhoto, as: "photos", attributes: ["id", "url", "sort_order"] }],
      limit: +pageSize,
      offset: +offset,
      order: [["createdAt", "DESC"]],
    });
    return { total: count, list: rows, pageNum: +pageNum, pageSize: +pageSize };
  }

  async findNearbyStores(longitude, latitude, pageNum = 1, pageSize = 20, keyword = "") {
    const offset = (pageNum - 1) * pageSize;
    const whereOpt = {};
    if (keyword) {
      whereOpt[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { address: { [Op.like]: `%${keyword}%` } },
      ];
    }
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
      include: [{ model: StorePhoto, as: "photos", attributes: ["id", "url", "sort_order"] }],
      limit: +pageSize,
      offset: +offset,
      order: sequelize.literal("distance ASC"),
    });

    return { total: count, list: rows, pageNum: +pageNum, pageSize: +pageSize };
  }

  async getStoreById(id) {
    const res = await Store.findOne({
      where: { id },
      include: [{ model: StorePhoto, as: "photos", attributes: ["id", "url", "sort_order"], order: [["sort_order", "ASC"]] }],
    });
    return res ? res.toJSON() : null;
  }

  async getStoreListWithCoords() {
    const rows = await Store.findAll({
      where: {
        longitude: { [Op.ne]: null },
        latitude: { [Op.ne]: null },
      },
      include: [{ model: StorePhoto, as: "photos", attributes: ["id", "url", "sort_order"] }],
      attributes: ["id", "name", "address", "longitude", "latitude", "status", "phone", "cover", "province", "city", "district"],
      order: [["createdAt", "DESC"]],
    });
    return rows;
  }

  async updateStoreById(id, storeData, photos) {
    const transaction = await sequelize.transaction();
    try {
      const [affected] = await Store.update(storeData, { where: { id }, transaction });

      if (Array.isArray(photos)) {
        // 删除旧照片
        await StorePhoto.destroy({ where: { store_id: id }, transaction });
        // 插入新照片
        if (photos.length > 0) {
          const photoRecords = photos.map((url, index) => ({
            store_id: id,
            url,
            sort_order: index,
          }));
          await StorePhoto.bulkCreate(photoRecords, { transaction });
        }
      }

      await transaction.commit();
      return affected > 0;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async deleteStoreById(id) {
    // 检查门店下是否有商品
    const goodsCount = await Goods.count({ where: { store_id: id } });
    if (goodsCount > 0) {
      throw new Error(`该门店下还有 ${goodsCount} 个商品，请先删除门店下的商品再删除门店`);
    }

    const transaction = await sequelize.transaction();
    try {
      await StorePhoto.destroy({ where: { store_id: id }, transaction });
      const res = await Store.destroy({ where: { id }, transaction });
      await transaction.commit();
      return res > 0;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async checkStoreOwnership(id, user_id) {
    const store = await Store.findOne({ where: { id, user_id } });
    return !!store;
  }
}

module.exports = new StoreService();
