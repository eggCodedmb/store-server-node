const { Banner } = require("../model/index");
const { Op } = require("sequelize");

class BannerService {
  async createBanner(banner) {
    const res = await Banner.create(banner);
    return res.dataValues;
  }

  async updateBanner(id, banner) {
    const res = await Banner.update(banner, { where: { id } });
    return res[0] > 0;
  }

  async removeBanner(id) {
    const res = await Banner.destroy({ where: { id } });
    return res > 0;
  }

  async findAllBanners(pageSize = 10, pageNum = 1, title = "", storeId = "") {
    const offset = (pageNum - 1) * pageSize;
    const whereOpt = {};
    if (title) {
      whereOpt.title = { [Op.like]: `%${title}%` };
    }
    
    // 如果有指定门店ID，进行筛选
    // 0 或 "0" 表示全局或全部，非0时进行筛选
    if (storeId && storeId !== "0" && storeId !== 0) {
      whereOpt.store_id = storeId;
    }

    const { count, rows } = await Banner.findAndCountAll({
      where: whereOpt,
      offset: +offset,
      limit: +pageSize,
      order: [["sort_order", "ASC"], ["createdAt", "DESC"]],
    });

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: rows,
    };
  }

  async findActiveBanners(storeId = "") {
    const whereOpt = {
      is_active: true,
    };
    
    // 如果小程序传入了当前选择的门店ID
    // 则返回该门店专属的 Banner 以及全局通用的 Banner (store_id 为 null)
    if (storeId) {
      whereOpt[Op.or] = [
        { store_id: storeId },
        { store_id: null }
      ];
    } else {
      // 否则只返回全局通用的 Banner
      whereOpt.store_id = null;
    }

    const rows = await Banner.findAll({
      where: whereOpt,
      order: [["sort_order", "ASC"], ["createdAt", "DESC"]],
    });

    return rows;
  }

  async findBannerById(id) {
    const res = await Banner.findByPk(id);
    return res ? res.dataValues : null;
  }
}

module.exports = new BannerService();
