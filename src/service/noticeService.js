const { Notice } = require("../model/index");
const { Op } = require("sequelize");

class NoticeService {
  async createNotice(notice) {
    const res = await Notice.create(notice);
    return res.dataValues;
  }

  async updateNotice(id, notice) {
    const res = await Notice.update(notice, { where: { id } });
    return res[0] > 0;
  }

  async removeNotice(id) {
    const res = await Notice.destroy({ where: { id } });
    return res > 0;
  }

  async findAllNotice(pageSize = 10, pageNum = 1, title = "", storeId = "") {
    const offset = (pageNum - 1) * pageSize;
    const whereOpt = {};
    if (title) {
      whereOpt.title = { [Op.like]: `%${title}%` };
    }
    
    if (storeId) {
      whereOpt[Op.or] = [
        { store_id: storeId },
        { store_id: null }
      ];
    }

    const { count, rows } = await Notice.findAndCountAll({
      where: whereOpt,
      offset: +offset,
      limit: +pageSize,
      order: [["createdAt", "DESC"]],
    });

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: rows,
    };
  }

  async findNoticeById(id) {
    const res = await Notice.findByPk(id);
    return res ? res.dataValues : null;
  }
}

module.exports = new NoticeService();
